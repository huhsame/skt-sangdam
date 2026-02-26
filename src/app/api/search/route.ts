import { NextRequest, NextResponse } from "next/server";
import { getEmbedding } from "@/lib/openai";
import { openai } from "@/lib/openai";
import { getSupabase } from "@/lib/supabase";

async function extractKeywords(query: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `통신사 고객센터 매뉴얼 검색 시스템입니다.
고객의 질문에서 매뉴얼 검색용 핵심 키워드를 추출하세요.
고객의 구어체를 통신사 공식 용어로 변환하고, 동의어도 포함하세요.

매뉴얼 주요 주제: 요금제, 요금/청구/납부, 부가서비스, 데이터, 보험, 멤버십, 기기변경, 신규가입, 번호이동(MNP), 약정/할부, 분실/도난, 로밍, 명의변경, 일시정지, 해지, 네트워크/품질, 속도저하, 민원/VOC

예시:
- "유럽가요" → ["로밍", "해외", "유럽", "국제"]
- "여행갈때 폰 쓰고싶어요" → ["로밍", "해외", "여행"]
- "데이터가 모자라요" → ["데이터", "리필", "소진", "쿠폰"]
- "데이터가 끊겨요" → ["데이터", "속도저하", "네트워크", "장애"]
- "폰을 바꿨는데요" → ["기기변경", "개통", "단말"]
- "요금 너무 많이 나왔어" → ["요금", "청구", "과금", "이의"]
- "폰 잃어버렸어요" → ["분실", "도난", "정지", "보험"]
- "번호 옮기고 싶어요" → ["번호이동", "MNP", "전입"]
- "해지하고 싶어요" → ["해지", "위약금", "해약"]
- "인터넷이 느려요" → ["속도", "저하", "데이터", "네트워크"]

JSON 배열만 출력하세요. 최대 6개.`,
        },
        { role: "user", content: query },
      ],
      temperature: 0,
      max_tokens: 100,
    });
    const text = response.choices[0]?.message?.content?.trim() ?? "[]";
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]) as string[];
    }
  } catch {
    // 키워드 추출 실패 시 원본 쿼리를 키워드로 사용
  }
  return [query];
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    const trimmed = query.trim();

    // 임베딩 생성과 키워드 추출을 병렬로 실행
    const [embedding, keywords] = await Promise.all([
      getEmbedding(trimmed),
      extractKeywords(trimmed),
    ]);

    const { data, error } = await getSupabase().rpc("match_pages", {
      query_embedding: embedding,
      match_threshold: 0.2,
      match_count: 5,
      search_keywords: keywords,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return NextResponse.json({ error: "검색 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json({ results: data ?? [], keywords });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ error: "검색 중 오류가 발생했습니다.", keywords: [] }, { status: 500 });
  }
}
