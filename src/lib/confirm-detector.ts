export type ConfirmResult = "yes" | "no" | "unknown";

const POSITIVE_KEYWORDS = [
  "네",
  "예",
  "응",
  "어",
  "해주세요",
  "해줘",
  "좋아",
  "좋아요",
  "진행",
  "부탁",
  "부탁해",
  "부탁드려요",
  "그래",
  "그래요",
  "신청",
  "변경",
  "개통",
  "정지",
  "맞아",
  "맞아요",
  "알겠어",
  "동의",
  "할게요",
  "할래요",
  "해볼게요",
  "그렇게",
  "오케이",
  "ㅇㅇ",
  "ㅇㅋ",
  "네네",
  "넵",
  "당연",
];

const NEGATIVE_KEYWORDS = [
  "아니",
  "아니요",
  "아뇨",
  "안 해",
  "안해",
  "됐어",
  "됐습니다",
  "취소",
  "괜찮아",
  "괜찮습니다",
  "싫어",
  "싫어요",
  "말아",
  "하지 마",
  "하지마",
  "안 할",
  "안할",
  "필요 없",
  "필요없",
  "다음에",
  "나중에",
  "생각해",
  "고민",
  "ㄴㄴ",
  "노노",
];

export function detectConfirm(text: string): ConfirmResult {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return "unknown";

  for (const kw of NEGATIVE_KEYWORDS) {
    if (normalized.includes(kw)) return "no";
  }

  for (const kw of POSITIVE_KEYWORDS) {
    if (normalized.includes(kw)) return "yes";
  }

  return "unknown";
}
