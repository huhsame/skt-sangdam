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
  birthDate: "1989-07-22",
  address: "서울특별시 강남구 테헤란로 123",
  membershipPoints: "12,480 P",
  bundleStatus: "참 쉬운 가족결합 (3회선)",
  paymentMethod: "신한카드 자동이체 (25일)",
};

export const ROAMING_DATA = {
  currentStatus: "미신청",
  products: [
    { name: "U+ 로밍 데이터 무제한", region: "주요 70개국", price: "14,900원/일", data: "무제한(1GB 후 3Mbps)" },
    { name: "U+ 로밍 유럽", region: "유럽 주요국", price: "13,900원/일", data: "무제한(1GB 후 3Mbps) · 통화 30분 · 문자 50건" },
    { name: "U+ 로밍 미주", region: "미국/캐나다", price: "12,900원/일", data: "무제한(1GB 후 3Mbps) · 통화 30분 · 문자 50건" },
    { name: "U+ 로밍 일본", region: "일본", price: "11,900원/일", data: "무제한(1GB 후 3Mbps) · 통화 30분 · 문자 50건" },
    { name: "U+ 로밍 중국", region: "중국", price: "11,900원/일", data: "무제한(500MB 후 3Mbps) · 통화 30분 · 문자 50건" },
    { name: "U+ 로밍 동남아", region: "동남아 주요국", price: "11,900원/일", data: "무제한(1GB 후 3Mbps) · 통화 30분 · 문자 50건" },
    { name: "로밍 패스 7일", region: "주요 70개국", price: "49,000원/7일", data: "매일 1GB (후 3Mbps)" },
    { name: "로밍 패스 15일", region: "주요 70개국", price: "79,000원/15일", data: "매일 1GB (후 3Mbps)" },
    { name: "로밍 패스 30일", region: "주요 70개국", price: "129,000원/30일", data: "매일 1GB (후 3Mbps)" },
  ],
  regions: ["주요 70개국", "유럽", "미주", "일본", "중국", "동남아", "대양주", "기타"],
  autoRoamingNote: "기본 자동로밍 ON 상태. 요금제 미가입 시 데이터 0.55원/KB (부가세 포함) 종량 과금.",
};

export const PLAN_DATA = {
  current: {
    name: "5G 프리미어 에센셜",
    data: "무제한 (일 150GB 후 5Mbps)",
    call: "무제한",
    message: "무제한",
    price: "85,000원",
    benefits: "유독 1종 무료, VIP 멤버십",
  },
  available: [
    { name: "5G 시그니처", data: "완전 무제한", call: "무제한", message: "무제한", price: "130,000원", diff: "+45,000원" },
    { name: "5G 프리미어 슈퍼", data: "완전 무제한", call: "무제한", message: "무제한", price: "115,000원", diff: "+30,000원" },
    { name: "5G 프리미어 플러스", data: "무제한 (일 250GB 후 5Mbps)", call: "무제한", message: "무제한", price: "105,000원", diff: "+20,000원" },
    { name: "5G 프리미어 레귤러", data: "무제한 (일 200GB 후 5Mbps)", call: "무제한", message: "무제한", price: "95,000원", diff: "+10,000원" },
    { name: "5G 스탠다드 에센셜", data: "무제한 (일 100GB 후 5Mbps)", call: "무제한", message: "무제한", price: "75,000원", diff: "-10,000원" },
    { name: "5G 라이트+", data: "12GB (후 1Mbps)", call: "무제한", message: "무제한", price: "55,000원", diff: "-30,000원" },
    { name: "5G 미니", data: "6GB (후 400Kbps)", call: "무제한", message: "무제한", price: "47,000원", diff: "-38,000원" },
    { name: "유쓰 5G 프리미어 에센셜", data: "무제한 (일 200GB 후 5Mbps)", call: "무제한", message: "무제한", price: "85,000원", diff: "동일 (청년 +50GB)" },
    { name: "유쓰 5G 스탠다드 에센셜", data: "무제한 (일 130GB 후 5Mbps)", call: "무제한", message: "무제한", price: "75,000원", diff: "-10,000원 (청년 +30GB)" },
    { name: "유플러스 다이렉트 5G", data: "100GB (후 5Mbps)", call: "무제한", message: "무제한", price: "59,000원", diff: "-26,000원 (무약정·온라인 전용)" },
  ],
};

export const DEVICE_DATA = {
  current: {
    name: "Galaxy S24 Ultra",
    color: "티타늄 그레이",
    storage: "256GB",
    installment: "월 48,500원",
    remaining: "14개월",
    startDate: "2024-07-15",
    insurance: "U+안심보험 프리미엄 가입",
  },
  available: [
    { name: "Galaxy S25 Ultra", price: "1,698,400원", subsidy: "264,000원", installment: "월 59,800원", colors: "티타늄/실버/블랙/화이트" },
    { name: "Galaxy S25+", price: "1,355,200원", subsidy: "210,000원", installment: "월 47,800원", colors: "네이비/실버/그린/핑크골드" },
    { name: "Galaxy Z Fold6", price: "2,098,700원", subsidy: "330,000원", installment: "월 73,700원", colors: "실버 쉐도우/네이비/핑크" },
    { name: "Galaxy Z Flip6", price: "1,549,900원", subsidy: "265,000원", installment: "월 53,500원", colors: "민트/실버/옐로우/블루" },
    { name: "iPhone 16 Pro Max", price: "1,900,000원", subsidy: "198,000원", installment: "월 70,900원", colors: "데저트/내추럴/화이트/블랙" },
    { name: "iPhone 16 Pro", price: "1,550,000원", subsidy: "180,000원", installment: "월 57,000원", colors: "데저트/내추럴/화이트/블랙" },
    { name: "iPhone 16", price: "1,250,000원", subsidy: "160,000원", installment: "월 45,400원", colors: "울트라마린/티얼/핑크/화이트/블랙" },
    { name: "Pixel 9 Pro", price: "1,499,000원", subsidy: "175,000원", installment: "월 55,100원", colors: "옵시디언/포셀린/헤이즐" },
  ],
  options: ["공시지원금", "선택약정(25%할인)"],
  installmentTerms: ["24개월", "36개월", "48개월"],
};

export const LOST_STOLEN_DATA = {
  deviceStatus: "정상",
  insuranceStatus: "U+안심보험 프리미엄 가입",
  insuranceFee: "월 9,900원",
  insuranceCoverage: "파손 · 분실 · 도난 · 침수 · 배터리",
  insuranceClaimLimit: "연 2회",
  options: [
    { label: "분실 정지", desc: "일시정지 후 복구 가능", color: "yellow" },
    { label: "도난 정지", desc: "긴급 정지 + 경찰 신고 접수", color: "red" },
    { label: "위치 추적 요청", desc: "고객 동의 시 마지막 접속 기지국 안내", color: "blue" },
    { label: "원격 잠금", desc: "Find My Mobile / 나의 찾기 가이드", color: "purple" },
  ],
  recentCalls: [
    { time: "14:23", number: "02-1234-5678", type: "수신", duration: "3분 12초" },
    { time: "13:55", number: "010-9876-5432", type: "발신", duration: "1분 8초" },
    { time: "12:10", number: "1599-0011", type: "발신", duration: "5분 47초" },
    { time: "11:42", number: "010-2345-6789", type: "수신", duration: "0분 0초 (부재중)" },
    { time: "10:28", number: "070-7800-1234", type: "수신", duration: "2분 15초" },
    { time: "09:15", number: "010-5555-7890", type: "발신", duration: "0분 45초" },
  ],
  claimSteps: [
    "1. 분실/도난 정지 신청 (즉시)",
    "2. 경찰 신고 (도난 시 필수, 신고번호 발급)",
    "3. U+안심보험 청구 (사고 후 30일 이내)",
    "4. 자기부담금 납부 후 보상금 지급 또는 대체폰 수령",
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
  reasons: ["타사 이동", "요금 불만", "서비스 불만", "해외 이주", "통화품질 불량", "단말 고장", "결합 해지", "기타"],
  cancellationFlow: [
    "1. 본인확인 (명의자 직접)",
    "2. 해지 사유 청취 → 해지방어 옵션 제시",
    "3. 정산금 안내 (위약금/잔여할부금/미납금)",
    "4. 부가서비스/결합 동반 해지 안내",
    "5. 해지 확정 → 익영업일 0시 효력 발생",
  ],
};

export const DATA_ADDON_DATA = {
  usage: { used: 42.3, total: 150, unit: "GB", resetDate: "2026-06-01" },
  addons: [
    { name: "데이터 리필 1GB", price: "5,500원", active: false, category: "데이터" },
    { name: "데이터 리필 2GB", price: "8,800원", active: false, category: "데이터" },
    { name: "데이터 리필 5GB", price: "16,500원", active: false, category: "데이터" },
    { name: "안심 데이터 차단", price: "무료", active: true, category: "데이터" },
    { name: "안심 데이터 알림", price: "무료", active: true, category: "데이터" },
    { name: "U+ 데이터 함께쓰기", price: "무료", active: false, category: "데이터" },
    { name: "U+안심보험 프리미엄", price: "9,900원/월", active: true, category: "보험" },
    { name: "U+ 통화도우미", price: "1,100원/월", active: false, category: "통화" },
    { name: "후후-유플러스 (스팸 식별)", price: "무료", active: true, category: "통화" },
    { name: "U+ 스팸 차단", price: "무료", active: true, category: "통화" },
    { name: "자녀안심 위치알리미", price: "2,200원/월", active: false, category: "안심" },
    { name: "유독 1종 (요금제 포함)", price: "포함", active: true, category: "구독" },
    { name: "U+모바일tv 기본", price: "포함", active: true, category: "구독" },
    { name: "지니뮤직 데이터 무료", price: "포함", active: false, category: "구독" },
  ],
};

export const COUNSEL_HISTORY = [
  {
    date: "2026-04-28",
    time: "14:32",
    type: "요금 문의",
    channel: "전화",
    summary: "4월 청구 요금 이의 - 일 150GB 한도 초과 빈번 안내, 데이터 리필 2GB 또는 프리미어 레귤러 변경 추천",
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
    summary: "Galaxy S25 Ultra 사전예약 관련 문의 - 공시지원금 264,000원 / 선택약정 25% 비교 안내",
    agent: "김상담",
  },
  {
    date: "2026-02-05",
    time: "09:30",
    type: "로밍",
    channel: "전화",
    summary: "일본 도쿄 출장 로밍 신청 - U+ 로밍 일본 3일 가입 (11,900원/일 × 3일 = 35,700원)",
    agent: "최상담",
  },
  {
    date: "2026-01-22",
    time: "11:48",
    type: "멤버십",
    channel: "채팅",
    summary: "VIP 등급 혜택 안내 - 스타벅스 월 1회 무료 음료, CGV 연 6회 할인, 주유 L당 60원 적립",
    agent: "정상담",
  },
  {
    date: "2025-12-10",
    time: "15:20",
    type: "결합",
    channel: "전화",
    summary: "참 쉬운 가족결합 회선 추가 (배우자) - 결합할인 월 5,500원 추가 적용",
    agent: "박상담",
  },
  {
    date: "2025-11-03",
    time: "13:05",
    type: "기기/보험",
    channel: "전화",
    summary: "액정 파손 - U+안심보험 프리미엄 청구 절차 안내, 자기부담금 50,000원 후 수리 진행",
    agent: "이상담",
  },
  {
    date: "2025-09-18",
    time: "10:42",
    type: "약정",
    channel: "전화",
    summary: "선택약정 25% 재약정 안내 - 기존 약정 만료 임박, 24개월 재약정 가입 처리",
    agent: "최상담",
  },
];

export const BILLING_HISTORY = [
  {
    month: "2026년 4월",
    total: "129,543원",
    breakdown: [
      { item: "기본요금 (5G 프리미어 에센셜)", amount: "85,000원" },
      { item: "U+안심보험 프리미엄", amount: "9,900원" },
      { item: "단말 할부금 (Galaxy S24 Ultra)", amount: "48,500원" },
      { item: "선택약정 25% 할인", amount: "-21,250원" },
      { item: "참 쉬운 가족결합 할인", amount: "-5,500원" },
      { item: "유독 1종 결합 할인", amount: "-1,000원" },
      { item: "부가세 (10%)", amount: "13,893원" },
    ],
    status: "납부완료",
    payDate: "2026-04-25",
  },
  {
    month: "2026년 3월",
    total: "138,343원",
    breakdown: [
      { item: "기본요금 (5G 프리미어 에센셜)", amount: "85,000원" },
      { item: "U+안심보험 프리미엄", amount: "9,900원" },
      { item: "데이터 리필 2GB", amount: "8,800원" },
      { item: "단말 할부금", amount: "48,500원" },
      { item: "선택약정 25% 할인", amount: "-21,250원" },
      { item: "참 쉬운 가족결합 할인", amount: "-5,500원" },
      { item: "부가세 (10%)", amount: "14,773원" },
    ],
    status: "납부완료",
    payDate: "2026-03-25",
  },
  {
    month: "2026년 2월",
    total: "165,743원",
    breakdown: [
      { item: "기본요금 (5G 프리미어 에센셜)", amount: "85,000원" },
      { item: "U+안심보험 프리미엄", amount: "9,900원" },
      { item: "U+ 로밍 일본 3일", amount: "35,700원" },
      { item: "단말 할부금", amount: "48,500원" },
      { item: "선택약정 25% 할인", amount: "-21,250원" },
      { item: "참 쉬운 가족결합 할인", amount: "-5,500원" },
      { item: "부가세 (10%)", amount: "16,433원" },
    ],
    status: "납부완료",
    payDate: "2026-02-25",
  },
  {
    month: "2026년 1월",
    total: "129,543원",
    breakdown: [
      { item: "기본요금 (5G 프리미어 에센셜)", amount: "85,000원" },
      { item: "U+안심보험 프리미엄", amount: "9,900원" },
      { item: "단말 할부금", amount: "48,500원" },
      { item: "선택약정 25% 할인", amount: "-21,250원" },
      { item: "참 쉬운 가족결합 할인", amount: "-5,500원" },
      { item: "유독 1종 결합 할인", amount: "-1,000원" },
      { item: "부가세 (10%)", amount: "13,893원" },
    ],
    status: "납부완료",
    payDate: "2026-01-25",
  },
  {
    month: "2025년 12월",
    total: "129,543원",
    breakdown: [
      { item: "기본요금 (5G 프리미어 에센셜)", amount: "85,000원" },
      { item: "U+안심보험 프리미엄", amount: "9,900원" },
      { item: "단말 할부금", amount: "48,500원" },
      { item: "선택약정 25% 할인", amount: "-21,250원" },
      { item: "참 쉬운 가족결합 할인", amount: "-5,500원" },
      { item: "유독 1종 결합 할인", amount: "-1,000원" },
      { item: "부가세 (10%)", amount: "13,893원" },
    ],
    status: "납부완료",
    payDate: "2025-12-25",
  },
  {
    month: "2025년 11월",
    total: "179,543원",
    breakdown: [
      { item: "기본요금 (5G 프리미어 에센셜)", amount: "85,000원" },
      { item: "U+안심보험 프리미엄", amount: "9,900원" },
      { item: "보험 자기부담금 (액정 파손)", amount: "50,000원" },
      { item: "단말 할부금", amount: "48,500원" },
      { item: "선택약정 25% 할인", amount: "-21,250원" },
      { item: "참 쉬운 가족결합 할인", amount: "-5,500원" },
      { item: "부가세 (10%)", amount: "12,893원" },
    ],
    status: "납부완료",
    payDate: "2025-11-25",
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
      "해외 여행 잦은 고객 - 연 1~2회 일본 출장, 1회 유럽 휴가. 장기 출장(7일↑) 시 로밍 패스 7일(49,000원)이 일별 가입보다 유리함. 차후 안내 우선 대상.",
  },
  {
    date: "2025-12-10",
    author: "박상담",
    content:
      "배우자 회선 추가하며 참 쉬운 가족결합 가입. 추후 자녀 회선(6세) 키즈 요금제 가입 의향 있음. 24년 만 4세 도달 시 알림 권장.",
  },
  {
    date: "2025-11-03",
    author: "이상담",
    content:
      "액정 파손 보험 청구 - 연 2회 한도 중 1회 사용. 자기부담금 5만원 안내. 향후 파손 빈번 시 보험 등급 검토 권장.",
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
    region: "유럽 (프랑스 · 이탈리아)",
    product: "U+ 로밍 유럽",
    cost: "97,300원 (7일)",
    dataUsed: "4.8GB",
  },
  {
    date: "2025-04-08 ~ 04-10",
    region: "일본 (오사카)",
    product: "U+ 로밍 일본",
    cost: "35,700원 (3일)",
    dataUsed: "1.5GB",
  },
  {
    date: "2024-11-20 ~ 11-25",
    region: "미국 (LA · 샌프란시스코)",
    product: "U+ 로밍 미주",
    cost: "77,400원 (6일)",
    dataUsed: "3.2GB",
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
  {
    name: "유독 프리미엄 무료 업그레이드",
    desc: "6개월간 유독 1종 → 프리미엄 1종 무료 (넷플릭스/디즈니+ 선택)",
    value: "총 약 50,000원 상당",
  },
  {
    name: "위약금 50% 감면 (이례적)",
    desc: "타사 이동 사유 시 위약금 절반 감면 + 신규 약정 시 추가 할인",
    value: "최대 93,000원 감면",
  },
];

export const MEMBERSHIP_DATA = {
  currentTier: "VIP",
  pointBalance: "12,480 P",
  pointEarnedThisMonth: "1,800 P",
  pointExpiringSoon: "320 P (2026-06-30 소멸)",
  benefits: [
    { category: "카페", merchant: "스타벅스", benefit: "월 1회 음료 무료 (Tall 사이즈)" },
    { category: "카페", merchant: "이디야커피", benefit: "음료 30% 할인 (1일 1회)" },
    { category: "영화", merchant: "CGV", benefit: "연 6회 2D 영화 4,000원 할인" },
    { category: "영화", merchant: "메가박스", benefit: "월 1회 2D 영화 50% 할인" },
    { category: "주유", merchant: "GS칼텍스", benefit: "L당 60원 할인" },
    { category: "편의점", merchant: "GS25/CU", benefit: "5% 할인 (1일 1회, 최대 1,000원)" },
    { category: "음식", merchant: "교촌치킨", benefit: "메뉴별 1,000~2,000원 할인" },
    { category: "쇼핑", merchant: "올리브영", benefit: "5,000원 이상 구매 시 1,000원 할인" },
  ],
};

export const BUNDLE_DATA = {
  bundleName: "참 쉬운 가족결합",
  totalLines: 3,
  monthlyDiscount: "월 5,500원",
  members: [
    { relation: "본인", name: "김민수", plan: "5G 프리미어 에센셜", line: "010-1234-5678" },
    { relation: "배우자", name: "이서연", plan: "5G 스탠다드 에센셜", line: "010-2345-6789" },
    { relation: "자녀", name: "김도현", plan: "키즈 안심 LTE", line: "010-3456-7890" },
  ],
  bundleHomeServices: ["U+tv 프리미엄 (월 27,500원)", "U+ 인터넷 1Gbps (월 39,600원)"],
  bundleHomeDiscount: "월 16,500원 통합 할인",
};

export const NETWORK_QUALITY = {
  currentSignal: "5G SA · -68 dBm (양호)",
  currentLocation: "서울 강남구 테헤란로",
  monthlyAvgSpeed: { download: "742 Mbps", upload: "85 Mbps" },
  recentIssues: [
    { date: "2026-04-12", time: "19:23", area: "강남역 일대", issue: "일시적 속도 저하 (10분)", resolved: true },
    { date: "2026-03-05", time: "08:15", area: "테헤란로", issue: "5G ↔ LTE 전환 빈번", resolved: true },
  ],
  coverageNote: "주거지·근무지 모두 5G SA 커버리지 양호. 음영지역 없음.",
};
