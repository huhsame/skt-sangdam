export const CUSTOMER = {
  name: "김민수",
  phone: "010-1234-5678",
  grade: "VIP",
  plan: "5G 프리미어 에센셜",
  joinDate: "2021-03-15",
  contractEnd: "2026-09-14",
  device: "Galaxy S24 Ultra",
  imei: "354832110XXXXXX",
  monthlyFee: "85,000",
  dataUsed: "42.3GB",
  dataTotal: "무제한 (일 150GB 후 5Mbps)",
};

export const ROAMING_DATA = {
  currentStatus: "미신청",
  products: [
    { name: "U+ 로밍 데이터 무제한", region: "주요 70개국", price: "14,900원/일", data: "무제한(1GB 후 3Mbps)" },
    { name: "U+ 로밍 유럽", region: "유럽 주요국", price: "13,900원/일", data: "무제한(1GB 후 3Mbps) · 통화 30분 · 문자 50건" },
    { name: "U+ 로밍 미주", region: "미국/캐나다", price: "12,900원/일", data: "무제한(1GB 후 3Mbps) · 통화 30분 · 문자 50건" },
    { name: "U+ 로밍 일본", region: "일본", price: "11,900원/일", data: "무제한(1GB 후 3Mbps) · 통화 30분 · 문자 50건" },
    { name: "U+ 로밍 동남아", region: "동남아 주요국", price: "11,900원/일", data: "무제한(1GB 후 3Mbps) · 통화 30분 · 문자 50건" },
    { name: "로밍 패스 7일", region: "주요 70개국", price: "49,000원/7일", data: "매일 1GB (후 3Mbps)" },
  ],
  regions: ["주요 70개국", "유럽", "미주", "일본", "중국", "동남아"],
};

export const PLAN_DATA = {
  current: {
    name: "5G 프리미어 에센셜",
    data: "무제한 (일 150GB 후 5Mbps)",
    call: "무제한",
    message: "무제한",
    price: "85,000원",
  },
  available: [
    {
      name: "5G 프리미어 레귤러",
      data: "무제한 (일 200GB 후 5Mbps)",
      call: "무제한",
      message: "무제한",
      price: "95,000원",
      diff: "+10,000원",
    },
    {
      name: "5G 프리미어 플러스",
      data: "무제한 (일 250GB 후 5Mbps)",
      call: "무제한",
      message: "무제한",
      price: "105,000원",
      diff: "+20,000원",
    },
    {
      name: "5G 스탠다드 에센셜",
      data: "무제한 (일 100GB 후 5Mbps)",
      call: "무제한",
      message: "무제한",
      price: "75,000원",
      diff: "-10,000원",
    },
    {
      name: "유쓰 5G 프리미어 에센셜",
      data: "무제한 (일 200GB 후 5Mbps)",
      call: "무제한",
      message: "무제한",
      price: "85,000원",
      diff: "동일 (청년 +50GB)",
    },
  ],
};

export const DEVICE_DATA = {
  current: {
    name: "Galaxy S24 Ultra",
    installment: "월 48,500원",
    remaining: "14개월",
    startDate: "2024-07-15",
  },
  available: [
    { name: "Galaxy S25 Ultra", price: "1,698,400원", subsidy: "264,000원", installment: "월 59,800원" },
    { name: "iPhone 16 Pro Max", price: "1,900,000원", subsidy: "198,000원", installment: "월 70,900원" },
    { name: "Galaxy Z Fold6", price: "2,098,700원", subsidy: "330,000원", installment: "월 73,700원" },
  ],
  options: ["공시지원금", "선택약정(25%할인)"],
};

export const LOST_STOLEN_DATA = {
  deviceStatus: "정상",
  insuranceStatus: "U+안심보험 프리미엄 가입",
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
  contractStart: "2024-09-15",
  contractEnd: "2026-09-14",
  remainingMonths: 4,
  penalty: "186,300원",
  penaltyBreakdown: [
    { item: "약정할인 반환금", amount: "142,800원" },
    { item: "단말 잔여 할부금", amount: "43,500원" },
  ],
  reasons: ["타사 이동", "요금 불만", "서비스 불만", "해외 이주", "기타"],
};

export const DATA_ADDON_DATA = {
  usage: { used: 42.3, total: 150, unit: "GB", resetDate: "2026-06-01" },
  addons: [
    { name: "데이터 리필 1GB", price: "5,500원", active: false },
    { name: "데이터 리필 2GB", price: "8,800원", active: false },
    { name: "데이터 리필 5GB", price: "16,500원", active: false },
    { name: "안심 데이터 차단", price: "무료", active: true },
    { name: "안심 데이터 알림", price: "무료", active: true },
    { name: "U+안심보험 프리미엄", price: "9,900원/월", active: true },
    { name: "유독 1종 (요금제 포함)", price: "포함", active: true },
  ],
};

export const COUNSEL_HISTORY = [
  {
    date: "2026-04-28",
    time: "14:32",
    type: "요금 문의",
    channel: "전화",
    summary: "4월 청구 요금 이의 - 일 150GB 한도 안내, 데이터 리필 2GB 추천",
    agent: "박상담",
  },
  {
    date: "2026-04-15",
    time: "10:15",
    type: "부가서비스",
    channel: "채팅",
    summary: "유독 1종 무료 혜택 안내 (지니뮤직 선택) + 안심 데이터 알림 활성화",
    agent: "이상담",
  },
  {
    date: "2026-03-20",
    time: "16:45",
    type: "기기 문의",
    channel: "전화",
    summary: "Galaxy S25 Ultra 사전예약 관련 문의 - 출시일/가격/공시지원금 안내",
    agent: "김상담",
  },
  {
    date: "2026-02-05",
    time: "09:30",
    type: "로밍",
    channel: "전화",
    summary: "일본 여행 로밍 신청 - U+ 로밍 일본 3일 가입 (11,900원/일 × 3일)",
    agent: "최상담",
  },
];

export const BILLING_HISTORY = [
  {
    month: "2026년 4월",
    total: "85,930원",
    breakdown: [
      { item: "기본요금 (5G 프리미어 에센셜)", amount: "85,000원" },
      { item: "U+안심보험 프리미엄", amount: "9,900원" },
      { item: "할인 (선택약정 25%)", amount: "-21,250원" },
      { item: "부가세 (10%)", amount: "8,393원" },
      { item: "단말 할부금 (Galaxy S24 Ultra)", amount: "48,500원" },
      { item: "유독 1종 결합 할인", amount: "-1,000원" },
    ],
    status: "납부완료",
    payDate: "2026-04-25",
  },
  {
    month: "2026년 3월",
    total: "94,430원",
    breakdown: [
      { item: "기본요금 (5G 프리미어 에센셜)", amount: "85,000원" },
      { item: "U+안심보험 프리미엄", amount: "9,900원" },
      { item: "데이터 리필 2GB", amount: "8,800원" },
      { item: "할인 (선택약정 25%)", amount: "-21,250원" },
      { item: "부가세 (10%)", amount: "9,273원" },
      { item: "단말 할부금", amount: "48,500원" },
    ],
    status: "납부완료",
    payDate: "2026-03-25",
  },
  {
    month: "2026년 2월",
    total: "121,830원",
    breakdown: [
      { item: "기본요금 (5G 프리미어 에센셜)", amount: "85,000원" },
      { item: "U+안심보험 프리미엄", amount: "9,900원" },
      { item: "U+ 로밍 일본 3일", amount: "35,700원" },
      { item: "할인 (선택약정 25%)", amount: "-21,250원" },
      { item: "부가세 (10%)", amount: "10,933원" },
      { item: "단말 할부금", amount: "48,500원" },
    ],
    status: "납부완료",
    payDate: "2026-02-25",
  },
];

export const CUSTOMER_NOTES = [
  {
    date: "2026-04-28",
    author: "박상담",
    content:
      "일 150GB 한도 후 속도제한 빈번 - 한 단계 상위(5G 프리미어 레귤러, 일 200GB) 추천했으나 고객 다음 청구 후 결정하겠다고 함. 데이터 리필 정기 이용도 옵션으로 제시.",
  },
  {
    date: "2026-02-05",
    author: "최상담",
    content:
      "해외 여행 잦은 고객 - 연 1~2회 일본 출장, 1회 유럽 휴가. 장기 출장 시 로밍 패스 7일(49,000원) 안내해두면 좋음.",
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
    date: "2026-02-03 ~ 02-05",
    region: "일본 (도쿄)",
    product: "U+ 로밍 일본",
    cost: "35,700원 (3일)",
    dataUsed: "1.2GB",
  },
  {
    date: "2025-07-15 ~ 07-22",
    region: "유럽 (프랑스)",
    product: "U+ 로밍 유럽",
    cost: "97,300원 (7일)",
    dataUsed: "4.8GB",
  },
];

export const RETENTION_OFFERS = [
  {
    name: "VIP 멤버십 특별 할인",
    desc: "6개월간 월 10,000원 추가 할인",
    value: "총 60,000원 혜택",
  },
  {
    name: "한 단계 업그레이드 무료 체험",
    desc: "3개월간 5G 프리미어 플러스(105,000원) 무료 체험",
    value: "총 60,000원 차액 면제",
  },
  {
    name: "최신 기기 변경 혜택",
    desc: "기기변경 시 추가 공시지원금 100,000원",
    value: "Galaxy S25 Ultra 특가",
  },
];
