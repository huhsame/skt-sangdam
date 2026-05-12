import { NextRequest } from "next/server";
import { parsePdf, getPdfPageCount } from "@/lib/pdf";
import { buildPageEmbeddingText } from "@/lib/text-utils";
import { openai, getEmbedding } from "@/lib/openai";
import { getSupabase } from "@/lib/supabase";
import { renderPdfPageToImage, closeBrowser } from "@/lib/pdf-renderer";

export const maxDuration = 300;
export const runtime = "nodejs";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

async function generateCustomerQuestions(pageText: string): Promise<string[]> {
  const prompt = `당신은 통신사 고객센터에 전화하는 고객입니다.
다음 매뉴얼 페이지 내용과 관련하여 고객이 실제로 할 수 있는 일상적인 질문 예시를 10개 생성해주세요.
전문 용어 없이 구어체로 작성하세요.

매뉴얼 내용:
${pageText.slice(0, 2000)}

JSON 배열 형식으로만 응답하세요. 예: ["질문1", "질문2", ...]`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const text = response.choices[0]?.message?.content?.trim() ?? "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as string[];
    }
    return [];
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  const supabase = getSupabase();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
      };

      try {
        // 1. 파일 수신 및 유효성 검증
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file || !file.name.endsWith(".pdf")) {
          send({ type: "error", message: "PDF 파일을 업로드해주세요." });
          controller.close();
          return;
        }

        if (file.size > MAX_FILE_SIZE) {
          send({ type: "error", message: "파일 크기가 50MB를 초과합니다." });
          controller.close();
          return;
        }

        // 2. PDF 파싱 — copy bytes to avoid detached ArrayBuffer
        const bytes = new Uint8Array(await file.arrayBuffer());
        const totalPages = await getPdfPageCount(bytes.buffer.slice(0));
        const pages = await parsePdf(bytes.buffer.slice(0));

        if (pages.length === 0) {
          send({ type: "error", message: "PDF에서 텍스트를 추출할 수 없습니다." });
          controller.close();
          return;
        }

        // 3. documents 테이블에 row 생성
        const { data: doc, error: docError } = await supabase
          .from("sangdam_documents")
          .insert({ filename: file.name, total_pages: totalPages, status: "processing" })
          .select("id")
          .single();

        if (docError || !doc) {
          send({ type: "error", message: "문서 생성 실패: " + (docError?.message ?? "unknown") });
          controller.close();
          return;
        }

        const documentId = doc.id;

        // 4. 각 페이지 처리
        const pdfBuffer = Buffer.from(bytes);

        // 페이지 처리: 이미지 렌더와 (질문 생성 + 임베딩)을 페이지 내에서 병렬화
        async function processPage(page: { pageNumber: number; text: string }) {
          const imagePromise = (async () => {
            try {
              const pngBuffer = await renderPdfPageToImage(pdfBuffer, page.pageNumber);
              const storagePath = `${documentId}/page-${page.pageNumber}.png`;
              const { error: uploadError } = await supabase.storage
                .from("sangdam-page-images")
                .upload(storagePath, pngBuffer, {
                  contentType: "image/png",
                  upsert: true,
                });
              if (uploadError) {
                console.error(`Page ${page.pageNumber} upload:`, uploadError.message);
                send({ type: "image_error", page: page.pageNumber, stage: "upload", message: uploadError.message });
                return null;
              }
              return supabase.storage.from("sangdam-page-images").getPublicUrl(storagePath).data.publicUrl;
            } catch (err) {
              const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
              console.error(`Page ${page.pageNumber} render:`, err);
              send({ type: "image_error", page: page.pageNumber, stage: "render", message: detail });
              return null;
            }
          })();

          const textPromise = (async () => {
            const questions = await generateCustomerQuestions(page.text);
            const embeddingText = buildPageEmbeddingText(page.text, questions);
            return getEmbedding(embeddingText);
          })();

          const [imageUrl, embedding] = await Promise.all([imagePromise, textPromise]);

          await supabase.from("sangdam_document_pages").insert({
            document_id: documentId,
            page_number: page.pageNumber,
            content: page.text,
            embedding,
            image_url: imageUrl,
          });
        }

        // 페이지 간에도 작은 배치(4개씩) 병렬로 처리해 wall-time 단축
        const BATCH = 4;
        let processed = 0;
        for (let i = 0; i < pages.length; i += BATCH) {
          const slice = pages.slice(i, i + BATCH);
          const results = await Promise.allSettled(slice.map(processPage));
          for (const r of results) {
            processed += 1;
            if (r.status === "rejected") {
              console.error("Page processing error:", r.reason);
            }
            send({ type: "progress", current: processed, total: pages.length });
          }
        }

        // 5. Puppeteer 브라우저 정리
        await closeBrowser();

        // 6. documents.status를 'ready'로 업데이트
        await supabase
          .from("sangdam_documents")
          .update({ status: "ready" })
          .eq("id", documentId);

        // 7. 완료 메시지
        send({ type: "complete", documentId });
      } catch (err) {
        console.error("Upload error:", err);
        const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
        send({ type: "error", message: `업로드 처리 중 오류: ${detail}` });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
