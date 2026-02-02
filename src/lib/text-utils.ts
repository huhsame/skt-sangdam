/**
 * 페이지 텍스트 + 고객 질문을 임베딩용 텍스트로 조합
 */
export function buildPageEmbeddingText(
  pageText: string,
  customerQuestions?: string[]
): string {
  const parts = [`[페이지 내용]\n${pageText}`];

  if (customerQuestions && customerQuestions.length > 0) {
    parts.push(`[고객 질문 예시]`);
    for (const q of customerQuestions) {
      parts.push(`- ${q}`);
    }
  }

  return parts.join("\n");
}
