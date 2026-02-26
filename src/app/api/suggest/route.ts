import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { query, contexts, keywords, screenType } = await request.json();

    if (!query || !contexts || contexts.length === 0) {
      return new Response(JSON.stringify({ error: "query와 contexts가 필요합니다." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const contextText = contexts
      .slice(0, 3)
      .map((c: string, i: number) => `[매뉴얼 ${i + 1}]\n${c}`)
      .join("\n\n");

    const systemPrompt = `당신은 통신사 AI 상담사입니다. 고객의 문의에 대해 매뉴얼을 기반으로 정확하고 친절하게 응대합니다.

규칙:
- 반드시 제공된 매뉴얼 내용만 기반으로 답변하세요
- 200자 이내로 간결하게 답변하세요
- 존댓말을 사용하세요
- 구체적인 금액, 조건 등을 포함하세요
- 고객이 바로 이해할 수 있는 자연스러운 한국어로 답변하세요
- 인사말 없이 바로 본론으로 들어가세요
- 응답 마지막에 반드시 고객에게 확인 질문을 포함하세요 (예: "~도와드릴까요?", "~진행할까요?", "~신청해드릴까요?")

현재 CRM 화면: ${screenType ?? "없음"}
관련 키워드: ${keywords?.join(", ") ?? "없음"}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `고객 문의: "${query}"\n\n참고 매뉴얼:\n${contextText}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Suggest API error:", error);
    return new Response(JSON.stringify({ error: "응답 생성 중 오류가 발생했습니다." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
