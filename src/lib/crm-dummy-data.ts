export const CUSTOMER = {
  name: "김민수",
  phone: "010-1234-5678",
  grade: "VIP",
  plan: "T플랜 에센셜",
  joinDate: "2021-03-15",
  contractEnd: "2025-09-14",
  device: "Galaxy S24 Ultra",
  imei: "354832110XXXXXX",
  monthlyFee: "69,000",
  dataUsed: "42.3GB",
  dataTotal: "100GB",
};

export const ROAMING_DATA = {
  currentStatus: "미신청",
  products: [
    { name: "baro 로밍 데이터", region: "유럽/미주", price: "11,000원/일", data: "무제한(1GB후 속도제한)" },
    { name: "baro 로밍 데이터 미니", region: "유럽/미주", price: "7,700원/일", data: "500MB" },
    { name: "baro 로밍 OnePass", region: "전세계", price: "33,000원/5일", data: "5GB" },
    { name: "T로밍 데이터 무제한", region: "아시아", price: "9,900원/일", data: "무제한" },
  ],
  regions: ["유럽", "미주", "아시아", "일본", "중국", "동남아", "대양주"],
};

export const PLAN_DATA = {
  current: { name: "T플랜 에센셜", data: "100GB", call: "무제한", message: "무제한", price: "69,000원" },
  available: [
    { name: "T플랜 스페셜", data: "150GB", call: "무제한", message: "무제한", price: "79,000원", diff: "+10,000원" },
    { name: "T플랜 프리미엄", data: "무제한", call: "무제한", message: "무제한", price: "99,000원", diff: "+30,000원" },
    { name: "T플랜 라이트", data: "50GB", call: "무제한", message: "무제한", price: "55,000원", diff: "-14,000원" },
    { name: "0 청년 요금제", data: "60GB", call: "무제한", message: "무제한", price: "55,000원", diff: "-14,000원" },
  ],
};

export const DEVICE_DATA = {
  current: { name: "Galaxy S24 Ultra", installment: "월 48,500원", remaining: "14개월", startDate: "2024-07-15" },
  available: [
    { name: "Galaxy S25 Ultra", price: "1,698,400원", subsidy: "264,000원", installment: "월 59,800원" },
    { name: "iPhone 16 Pro Max", price: "1,900,000원", subsidy: "198,000원", installment: "월 70,900원" },
    { name: "Galaxy Z Fold6", price: "2,098,700원", subsidy: "330,000원", installment: "월 73,700원" },
  ],
  options: ["공시지원금", "선택약정(25%할인)"],
};

export const LOST_STOLEN_DATA = {
  deviceStatus: "정상",
  insuranceStatus: "T안심보험 가입",
  insuranceFee: "월 9,900원",
  options: [
    { label: "분실 정지", desc: "일시정지 후 복구 가능", color: "yellow" },
    { label: "도난 정지", desc: "긴급 정지 + 경찰 신고 접수", color: "red" },
  ],
  recentCalls: [
    { time: "14:23", number: "02-1234-5678", type: "수신" },
    { time: "13:55", number: "010-9876-5432", type: "발신" },
    { time: "12:10", number: "1599-0011", type: "발신" },
  ],
};

export const CANCELLATION_DATA = {
  contractType: "선택약정(24개월)",
  contractStart: "2024-03-15",
  contractEnd: "2026-03-14",
  remainingMonths: 14,
  penalty: "186,300원",
  penaltyBreakdown: [
    { item: "약정할인 반환금", amount: "142,800원" },
    { item: "단말 잔여 할부금", amount: "43,500원" },
  ],
  reasons: ["타사 이동", "요금 불만", "서비스 불만", "해외 이주", "기타"],
};

export const DATA_ADDON_DATA = {
  usage: { used: 42.3, total: 100, unit: "GB", resetDate: "2025-02-01" },
  addons: [
    { name: "T 데이터 리필 쿠폰 1GB", price: "3,300원", active: false },
    { name: "T 데이터 리필 쿠폰 2GB", price: "5,500원", active: false },
    { name: "통화 매니아", price: "2,200원/월", active: true },
    { name: "T멤버십 VIP", price: "무료", active: true },
    { name: "스팸 차단 서비스", price: "무료", active: true },
    { name: "T가드(안심보험)", price: "9,900원/월", active: true },
  ],
};

export const COUNSEL_HISTORY = [
  {
    date: "2025-01-28",
    time: "14:32",
    type: "요금 문의",
    channel: "전화",
    summary: "1월 청구 요금 이의 - 데이터 초과 과금 안내, 리필쿠폰 추천",
    agent: "박상담",
  },
  {
    date: "2025-01-15",
    time: "10:15",
    type: "부가서비스",
    channel: "채팅",
    summary: "T멤버십 VIP 혜택 안내 및 스팸차단 서비스 가입 처리",
    agent: "이상담",
  },
  {
    date: "2024-12-20",
    time: "16:45",
    type: "기기 문의",
    channel: "전화",
    summary: "Galaxy S25 Ultra 사전예약 관련 문의 - 출시일/가격 안내",
    agent: "김상담",
  },
  {
    date: "2024-11-05",
    time: "09:30",
    type: "로밍",
    channel: "전화",
    summary: "일본 여행 로밍 신청 - baro 로밍 데이터 미니 3일 가입",
    agent: "최상담",
  },
];

export const BILLING_HISTORY = [
  {
    month: "2025년 1월",
    total: "78,900원",
    breakdown: [
      { item: "기본요금 (T플랜 에센셜)", amount: "69,000원" },
      { item: "T가드(안심보험)", amount: "9,900원" },
      { item: "할인 (선택약정 25%)", amount: "-17,250원" },
      { item: "부가세", amount: "17,250원" },
    ],
    status: "납부완료",
    payDate: "2025-01-25",
  },
  {
    month: "2024년 12월",
    total: "82,400원",
    breakdown: [
      { item: "기본요금 (T플랜 에센셜)", amount: "69,000원" },
      { item: "T가드(안심보험)", amount: "9,900원" },
      { item: "데이터 초과 (2GB)", amount: "3,500원" },
      { item: "할인 (선택약정 25%)", amount: "-17,250원" },
      { item: "부가세", amount: "17,250원" },
    ],
    status: "납부완료",
    payDate: "2024-12-26",
  },
  {
    month: "2024년 11월",
    total: "91,700원",
    breakdown: [
      { item: "기본요금 (T플랜 에센셜)", amount: "69,000원" },
      { item: "T가드(안심보험)", amount: "9,900원" },
      { item: "baro 로밍 데이터 미니 3일", amount: "23,100원" },
      { item: "할인 (선택약정 25%)", amount: "-17,250원" },
      { item: "부가세", amount: "6,950원" },
    ],
    status: "납부완료",
    payDate: "2024-11-25",
  },
];

export const CUSTOMER_NOTES = [
  {
    date: "2025-01-28",
    author: "박상담",
    content:
      "고객 데이터 초과 빈번 - 요금제 업그레이드 또는 데이터 리필쿠폰 정기 이용 권유 필요. 고객 반응: 다음 달 초과 시 요금제 변경 고려하겠다고 함.",
  },
  {
    date: "2024-11-05",
    author: "최상담",
    content:
      "해외 여행 잦은 고객 - 연간 로밍 패키지 출시 시 우선 안내 대상. 주로 일본/유럽 방문.",
  },
];

export const DAILY_DATA_USAGE = [
  { day: "월", used: 5.2 },
  { day: "화", used: 7.8 },
  { day: "수", used: 4.1 },
  { day: "목", used: 9.3 },
  { day: "금", used: 6.5 },
  { day: "토", used: 3.9 },
  { day: "일", used: 5.5 },
];

export const ROAMING_HISTORY = [
  {
    date: "2024-11-03 ~ 11-05",
    region: "일본",
    product: "baro 로밍 데이터 미니",
    cost: "23,100원",
    dataUsed: "1.2GB",
  },
  {
    date: "2024-07-15 ~ 07-22",
    region: "유럽 (프랑스)",
    product: "baro 로밍 데이터",
    cost: "77,000원",
    dataUsed: "4.8GB",
  },
];

export const RETENTION_OFFERS = [
  {
    name: "VIP 특별 할인",
    desc: "6개월간 월 10,000원 추가 할인",
    value: "총 60,000원 혜택",
  },
  {
    name: "데이터 무제한 업그레이드",
    desc: "3개월간 데이터 무제한 제공",
    value: "T플랜 프리미엄 무료 체험",
  },
  {
    name: "최신 기기 할인",
    desc: "기기변경 시 추가 공시지원금 100,000원",
    value: "Galaxy S25 Ultra 특가",
  },
];
