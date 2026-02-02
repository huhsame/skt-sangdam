import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { buildPageEmbeddingText } from "../src/lib/text-utils";

// --- 설정 ---
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("환경변수를 설정해주세요: OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error("사용법: npx tsx scripts/seed-embeddings.ts <pdf-file-path>");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MIN_PAGE_LENGTH = 50;

// --- PDF 파싱 (동적 import) ---
async function parsePdfFile(filePath: string) {
  const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  GlobalWorkerOptions.workerSrc = "";

  const data = new Uint8Array(fs.readFileSync(filePath));
  const pdf = await getDocument({ data, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true }).promise;

  const pages: { pageNumber: number; text: string }[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (text.length >= MIN_PAGE_LENGTH) {
      pages.push({ pageNumber: i, text });
    }
  }

  return { totalPages: pdf.numPages, pages };
}

// --- 고객 일상어 질문 생성 ---
async function generateCustomerQuestions(pageText: string): Promise<string[]> {
  const prompt = `당신은 SK텔레콤 고객센터에 전화하는 고객입니다.
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
  } catch (err) {
    console.warn(`  [경고] 질문 생성 실패:`, err);
    return [];
  }
}

// --- 임베딩 생성 ---
async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

// --- 메인 ---
async function main() {
  const resolvedPath = path.resolve(pdfPath);
  const filename = path.basename(resolvedPath);

  console.log(`=== PDF 임베딩 시딩 시작: ${filename} ===\n`);

  // 1. PDF 파싱
  console.log("PDF 파싱 중...");
  const { totalPages, pages } = await parsePdfFile(resolvedPath);
  console.log(`총 ${totalPages}페이지 중 ${pages.length}페이지 텍스트 추출 완료\n`);

  // 2. documents 테이블에 row 생성
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .insert({ filename, total_pages: totalPages, status: "processing" })
    .select("id")
    .single();

  if (docError || !doc) {
    console.error("문서 생성 실패:", docError);
    process.exit(1);
  }

  const documentId = doc.id;
  console.log(`문서 ID: ${documentId}\n`);

  // 3. 각 페이지 처리
  let count = 0;
  for (const page of pages) {
    count++;
    console.log(`[${count}/${pages.length}] 페이지 ${page.pageNumber}`);

    // 고객 질문 생성
    console.log("  - 고객 질문 생성 중...");
    const questions = await generateCustomerQuestions(page.text);
    console.log(`  - ${questions.length}개 질문 생성`);

    // 임베딩 텍스트 조합
    const embeddingText = buildPageEmbeddingText(page.text, questions);

    // 임베딩 생성
    console.log("  - 임베딩 생성 중...");
    const embedding = await getEmbedding(embeddingText);

    // document_pages에 삽입
    const { error: insertError } = await supabase.from("document_pages").insert({
      document_id: documentId,
      page_number: page.pageNumber,
      content: page.text,
      embedding,
    });

    if (insertError) {
      console.error(`  [오류] 삽입 실패:`, insertError);
    } else {
      console.log("  - 완료");
    }

    // 레이트 리밋 방지
    await new Promise((r) => setTimeout(r, 200));
  }

  // 4. documents.status를 'ready'로 업데이트
  await supabase
    .from("documents")
    .update({ status: "ready" })
    .eq("id", documentId);

  console.log(`\n=== 시딩 완료: ${count}페이지 처리, 문서 ID: ${documentId} ===`);
}

main().catch((err) => {
  console.error("시딩 실패:", err);
  process.exit(1);
});
