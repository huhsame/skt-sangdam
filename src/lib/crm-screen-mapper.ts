export type CrmScreenType =
  | "roaming"
  | "lost-stolen"
  | "cancellation"
  | "device-change"
  | "plan-change"
  | "data-addon";

interface ScreenRule {
  type: CrmScreenType;
  keywords: string[];
}

const SCREEN_RULES: ScreenRule[] = [
  {
    type: "roaming",
    keywords: ["로밍", "해외", "국제", "유럽", "여행", "일본", "미국", "중국", "태국", "베트남", "호주", "동남아", "대양주", "캐나다", "하와이", "괌", "사이판", "필리핀", "싱가포르"],
  },
  {
    type: "lost-stolen",
    keywords: ["분실", "도난", "정지", "잠금", "보험"],
  },
  {
    type: "cancellation",
    keywords: ["해지", "위약금", "해약", "탈퇴"],
  },
  {
    type: "device-change",
    keywords: ["기기변경", "개통", "단말", "번호이동", "MNP", "전입", "신규가입"],
  },
  {
    type: "plan-change",
    keywords: ["요금제", "요금", "청구", "과금", "납부", "약정", "할부", "이의", "업그레이드", "다운그레이드", "플랜"],
  },
  {
    type: "data-addon",
    keywords: ["데이터", "부가서비스", "리필", "소진", "쿠폰", "속도", "네트워크", "멤버십"],
  },
];

export function determineCrmScreen(keywords: string[]): CrmScreenType {
  const lower = keywords.map((k) => k.toLowerCase());
  for (const rule of SCREEN_RULES) {
    if (rule.keywords.some((rk) => lower.some((k) => k.includes(rk)))) {
      return rule.type;
    }
  }
  return "data-addon"; // 기본 폴백
}

export const SCREEN_LABELS: Record<CrmScreenType, string> = {
  roaming: "로밍 설정",
  "lost-stolen": "분실/도난 신고",
  cancellation: "해지 처리",
  "device-change": "기기변경/개통",
  "plan-change": "요금제 변경",
  "data-addon": "데이터/부가서비스",
};
