import type { CrmActionStep, CrmAction, CrmScreenType } from "@/types/crm";
import { ROAMING_DATA, PLAN_DATA, DEVICE_DATA, LOST_STOLEN_DATA, CANCELLATION_DATA, DATA_ADDON_DATA } from "@/lib/crm-dummy-data";

interface ActionSequence {
  steps: CrmActionStep[];
  dispatches: CrmAction[];
}

// --- Roaming region/product resolution based on keywords ---

const REGION_KEYWORD_MAP: Record<string, string[]> = {
  유럽: ["유럽", "프랑스", "독일", "영국", "이탈리아", "스페인", "스위스", "네덜란드", "오스트리아"],
  미주: ["미국", "미주", "캐나다", "하와이", "괌", "사이판"],
  아시아: ["아시아"],
  일본: ["일본", "도쿄", "오사카", "교토", "후쿠오카", "삿포로"],
  중국: ["중국", "베이징", "상하이", "광저우", "선전"],
  동남아: ["동남아", "베트남", "태국", "필리핀", "싱가포르", "인도네시아", "발리", "방콕", "다낭", "세부"],
  대양주: ["대양주", "호주", "뉴질랜드", "시드니", "멜버른"],
};

const ASIA_REGIONS = new Set(["아시아", "일본", "중국", "동남아"]);

function resolveRoamingRegion(keywords: string[]): string {
  const lower = keywords.map((k) => k.toLowerCase());
  for (const [region, kws] of Object.entries(REGION_KEYWORD_MAP)) {
    if (kws.some((rk) => lower.some((k) => k.includes(rk)))) {
      return region;
    }
  }
  return "유럽"; // fallback
}

function resolveRoamingProduct(region: string): { index: number; name: string } {
  // 아시아 계열 지역이면 아시아 상품을, 유럽/미주면 유럽/미주 상품을, 나머지는 전세계 상품
  if (ASIA_REGIONS.has(region)) {
    const idx = ROAMING_DATA.products.findIndex((p) => p.region === "아시아");
    if (idx >= 0) return { index: idx, name: ROAMING_DATA.products[idx].name };
  }
  if (region === "유럽" || region === "미주") {
    const idx = ROAMING_DATA.products.findIndex((p) => p.region.includes("유럽"));
    if (idx >= 0) return { index: idx, name: ROAMING_DATA.products[idx].name };
  }
  // 대양주 등 → 전세계 상품
  const idx = ROAMING_DATA.products.findIndex((p) => p.region === "전세계");
  if (idx >= 0) return { index: idx, name: ROAMING_DATA.products[idx].name };
  return { index: 0, name: ROAMING_DATA.products[0].name };
}

function buildRoamingSequence(keywords: string[]): ActionSequence {
  const region = resolveRoamingRegion(keywords);
  const product = resolveRoamingProduct(region);

  return {
    steps: [
      {
        elementId: `region-${region}`,
        action: "click",
        label: `${region} 지역 선택`,
        delayBefore: 400,
        delayAfter: 800,
      },
      {
        elementId: `product-${product.index}`,
        action: "click",
        label: `${product.name} 선택`,
        delayBefore: 300,
        delayAfter: 800,
      },
      {
        elementId: "apply-roaming",
        action: "click",
        label: "로밍 신청 처리",
        delayBefore: 300,
        delayAfter: 1000,
      },
    ],
    dispatches: [
      { type: "ROAMING_SELECT_REGION", region },
      { type: "ROAMING_SELECT_PRODUCT", index: product.index },
      { type: "ROAMING_APPLY" },
    ],
  };
}

// --- Plan resolution based on keywords ---

type PlanIntent = "cheapest" | "expensive" | "up" | "down" | "data" | "unknown";

const PLAN_INTENT_KEYWORDS: { intent: PlanIntent; keywords: string[] }[] = [
  { intent: "cheapest", keywords: ["싼", "저렴", "최저", "제일 싼", "가장 싼", "싸게", "절약", "아끼"] },
  { intent: "expensive", keywords: ["비싼", "최고", "프리미엄", "제일 비싼", "가장 비싼", "좋은", "최상"] },
  { intent: "up", keywords: ["올려", "올리", "업그레이드", "높은", "높여", "더 비싼", "한 단계 위", "하나 위", "상위"] },
  { intent: "down", keywords: ["내려", "내리", "다운그레이드", "낮은", "낮춰", "더 싼", "한 단계 아래", "하나 아래", "하위"] },
  { intent: "data", keywords: ["데이터 많", "데이터 무제한", "무제한", "데이터 크", "용량 큰", "용량 많"] },
];

function parsePriceNumber(priceStr: string): number {
  return parseInt(priceStr.replace(/[^0-9]/g, ""), 10) || 0;
}

function parseDataGB(dataStr: string): number {
  if (dataStr === "무제한") return Infinity;
  const match = dataStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function resolvePlanIndex(keywords: string[]): { index: number; name: string } {
  const joined = keywords.join(" ").toLowerCase();
  const plans = PLAN_DATA.available;

  // Detect intent
  let intent: PlanIntent = "unknown";
  for (const rule of PLAN_INTENT_KEYWORDS) {
    if (rule.keywords.some((kw) => joined.includes(kw))) {
      intent = rule.intent;
      break;
    }
  }

  // Also check for direct plan name match
  for (let i = 0; i < plans.length; i++) {
    if (joined.includes(plans[i].name.toLowerCase())) {
      return { index: i, name: plans[i].name };
    }
  }

  const currentPrice = parsePriceNumber(PLAN_DATA.current.price);

  switch (intent) {
    case "cheapest": {
      // Lowest price among available
      let minIdx = 0;
      let minPrice = parsePriceNumber(plans[0].price);
      for (let i = 1; i < plans.length; i++) {
        const p = parsePriceNumber(plans[i].price);
        if (p < minPrice) { minPrice = p; minIdx = i; }
      }
      return { index: minIdx, name: plans[minIdx].name };
    }
    case "expensive": {
      // Highest price among available
      let maxIdx = 0;
      let maxPrice = parsePriceNumber(plans[0].price);
      for (let i = 1; i < plans.length; i++) {
        const p = parsePriceNumber(plans[i].price);
        if (p > maxPrice) { maxPrice = p; maxIdx = i; }
      }
      return { index: maxIdx, name: plans[maxIdx].name };
    }
    case "up": {
      // Cheapest plan that is more expensive than current
      let bestIdx = -1;
      let bestPrice = Infinity;
      for (let i = 0; i < plans.length; i++) {
        const p = parsePriceNumber(plans[i].price);
        if (p > currentPrice && p < bestPrice) { bestPrice = p; bestIdx = i; }
      }
      if (bestIdx >= 0) return { index: bestIdx, name: plans[bestIdx].name };
      // fallback: most expensive
      return resolvePlanByIntent("expensive", plans);
    }
    case "down": {
      // Most expensive plan that is cheaper than current
      let bestIdx = -1;
      let bestPrice = 0;
      for (let i = 0; i < plans.length; i++) {
        const p = parsePriceNumber(plans[i].price);
        if (p < currentPrice && p > bestPrice) { bestPrice = p; bestIdx = i; }
      }
      if (bestIdx >= 0) return { index: bestIdx, name: plans[bestIdx].name };
      // fallback: cheapest
      return resolvePlanByIntent("cheapest", plans);
    }
    case "data": {
      // Most data
      let maxIdx = 0;
      let maxData = parseDataGB(plans[0].data);
      for (let i = 1; i < plans.length; i++) {
        const d = parseDataGB(plans[i].data);
        if (d > maxData) { maxData = d; maxIdx = i; }
      }
      return { index: maxIdx, name: plans[maxIdx].name };
    }
    default:
      // No clear intent — default to first (one step up)
      return { index: 0, name: plans[0].name };
  }
}

function resolvePlanByIntent(
  intent: "cheapest" | "expensive",
  plans: typeof PLAN_DATA.available
): { index: number; name: string } {
  if (intent === "cheapest") {
    let minIdx = 0;
    let minPrice = parsePriceNumber(plans[0].price);
    for (let i = 1; i < plans.length; i++) {
      const p = parsePriceNumber(plans[i].price);
      if (p < minPrice) { minPrice = p; minIdx = i; }
    }
    return { index: minIdx, name: plans[minIdx].name };
  }
  let maxIdx = 0;
  let maxPrice = parsePriceNumber(plans[0].price);
  for (let i = 1; i < plans.length; i++) {
    const p = parsePriceNumber(plans[i].price);
    if (p > maxPrice) { maxPrice = p; maxIdx = i; }
  }
  return { index: maxIdx, name: plans[maxIdx].name };
}

function buildPlanChangeSequence(keywords: string[]): ActionSequence {
  const plan = resolvePlanIndex(keywords);

  return {
    steps: [
      {
        elementId: `plan-${plan.index}`,
        action: "click",
        label: `${plan.name} 선택`,
        delayBefore: 400,
        delayAfter: 800,
      },
      {
        elementId: "apply-plan",
        action: "click",
        label: "요금제 변경 처리",
        delayBefore: 300,
        delayAfter: 1000,
      },
    ],
    dispatches: [
      { type: "PLAN_SELECT", index: plan.index },
      { type: "PLAN_CHANGE" },
    ],
  };
}

// --- Device change resolution based on keywords ---

function resolveDevice(keywords: string[]): { index: number; name: string } {
  const joined = keywords.join(" ").toLowerCase();
  const devices = DEVICE_DATA.available;

  // Direct name match
  for (let i = 0; i < devices.length; i++) {
    const nameLower = devices[i].name.toLowerCase();
    if (joined.includes(nameLower)) return { index: i, name: devices[i].name };
  }
  // Partial brand/model match
  const brandMap: { keywords: string[]; deviceIndex: number }[] = [
    { keywords: ["아이폰", "iphone", "애플"], deviceIndex: devices.findIndex((d) => d.name.toLowerCase().includes("iphone")) },
    { keywords: ["폴드", "fold", "접는", "폴더블"], deviceIndex: devices.findIndex((d) => d.name.toLowerCase().includes("fold")) },
    { keywords: ["갤럭시", "galaxy", "삼성", "s25"], deviceIndex: devices.findIndex((d) => d.name.toLowerCase().includes("galaxy s")) },
  ];
  for (const rule of brandMap) {
    if (rule.deviceIndex >= 0 && rule.keywords.some((kw) => joined.includes(kw))) {
      return { index: rule.deviceIndex, name: devices[rule.deviceIndex].name };
    }
  }

  // Price intent
  if (["싼", "저렴", "싸게"].some((kw) => joined.includes(kw))) {
    let minIdx = 0;
    let minPrice = parsePriceNumber(devices[0].price);
    for (let i = 1; i < devices.length; i++) {
      const p = parsePriceNumber(devices[i].price);
      if (p < minPrice) { minPrice = p; minIdx = i; }
    }
    return { index: minIdx, name: devices[minIdx].name };
  }
  if (["비싼", "최고", "최상"].some((kw) => joined.includes(kw))) {
    let maxIdx = 0;
    let maxPrice = parsePriceNumber(devices[0].price);
    for (let i = 1; i < devices.length; i++) {
      const p = parsePriceNumber(devices[i].price);
      if (p > maxPrice) { maxPrice = p; maxIdx = i; }
    }
    return { index: maxIdx, name: devices[maxIdx].name };
  }

  return { index: 0, name: devices[0].name };
}

function resolveDeviceOption(keywords: string[]): string {
  const joined = keywords.join(" ").toLowerCase();
  if (["약정", "할인", "선택약정"].some((kw) => joined.includes(kw))) {
    return DEVICE_DATA.options[1]; // 선택약정(25%할인)
  }
  return DEVICE_DATA.options[0]; // 공시지원금 (default)
}

function buildDeviceChangeSequence(keywords: string[]): ActionSequence {
  const device = resolveDevice(keywords);
  const option = resolveDeviceOption(keywords);

  return {
    steps: [
      {
        elementId: `option-${option}`,
        action: "click",
        label: `${option} 선택`,
        delayBefore: 400,
        delayAfter: 600,
      },
      {
        elementId: `device-${device.index}`,
        action: "click",
        label: `${device.name} 선택`,
        delayBefore: 300,
        delayAfter: 800,
      },
      {
        elementId: "apply-device",
        action: "click",
        label: "기기변경 개통 처리",
        delayBefore: 300,
        delayAfter: 1000,
      },
    ],
    dispatches: [
      { type: "DEVICE_SELECT_OPTION", option },
      { type: "DEVICE_SELECT", index: device.index },
      { type: "DEVICE_OPEN" },
    ],
  };
}

// --- Lost/Stolen resolution based on keywords ---

function resolveLostStolenOption(keywords: string[]): { label: string } {
  const joined = keywords.join(" ").toLowerCase();
  // "도난" → 도난 정지, otherwise → 분실 정지
  if (["도난", "훔", "도둑", "절도"].some((kw) => joined.includes(kw))) {
    return { label: LOST_STOLEN_DATA.options[1].label }; // 도난 정지
  }
  return { label: LOST_STOLEN_DATA.options[0].label }; // 분실 정지
}

function buildLostStolenSequence(keywords: string[]): ActionSequence {
  const option = resolveLostStolenOption(keywords);

  return {
    steps: [
      {
        elementId: `option-${option.label}`,
        action: "click",
        label: `${option.label} 선택`,
        delayBefore: 400,
        delayAfter: 800,
      },
      {
        elementId: "apply-suspend",
        action: "click",
        label: "긴급 정지 처리",
        delayBefore: 300,
        delayAfter: 1000,
      },
    ],
    dispatches: [
      { type: "LOST_SELECT_OPTION", option: option.label },
      { type: "LOST_SUSPEND" },
    ],
  };
}

// --- Cancellation resolution based on keywords ---

function resolveCancellationReason(keywords: string[]): string {
  const joined = keywords.join(" ").toLowerCase();
  const reasons = CANCELLATION_DATA.reasons;

  const reasonKeywordMap: { reason: string; keywords: string[] }[] = [
    { reason: "타사 이동", keywords: ["타사", "번호이동", "이동", "다른 통신사", "kt", "lg"] },
    { reason: "요금 불만", keywords: ["요금", "비싸", "비싼", "과금", "청구", "돈"] },
    { reason: "서비스 불만", keywords: ["서비스", "불만", "불편", "품질", "속도", "느려"] },
    { reason: "해외 이주", keywords: ["해외", "이민", "이주", "유학", "출국"] },
  ];

  for (const rule of reasonKeywordMap) {
    if (reasons.includes(rule.reason) && rule.keywords.some((kw) => joined.includes(kw))) {
      return rule.reason;
    }
  }
  return "기타"; // fallback
}

function buildCancellationSequence(keywords: string[]): ActionSequence {
  const reason = resolveCancellationReason(keywords);

  return {
    steps: [
      {
        elementId: `reason-${reason}`,
        action: "select",
        value: reason,
        label: `"${reason}" 사유 선택`,
        delayBefore: 400,
        delayAfter: 600,
      },
      {
        elementId: "apply-cancel",
        action: "click",
        label: "해지 처리 실행",
        delayBefore: 300,
        delayAfter: 1000,
      },
    ],
    dispatches: [
      { type: "CANCEL_SELECT_REASON", reason },
      { type: "CANCEL_PROCESS" },
    ],
  };
}

// --- Data addon resolution based on keywords ---

function resolveAddonIndex(keywords: string[]): { index: number; name: string } {
  const joined = keywords.join(" ").toLowerCase();
  const addons = DATA_ADDON_DATA.addons;

  // Direct name match
  for (let i = 0; i < addons.length; i++) {
    if (joined.includes(addons[i].name.toLowerCase())) {
      return { index: i, name: addons[i].name };
    }
  }

  // Keyword-based intent for inactive addons (things you'd want to add)
  const addonKeywordMap: { keywords: string[]; match: (name: string) => boolean }[] = [
    { keywords: ["2gb", "2기가", "리필 2", "쿠폰 2"], match: (n) => n.includes("2GB") },
    { keywords: ["1gb", "1기가", "리필 1", "쿠폰 1", "리필"], match: (n) => n.includes("1GB") },
    { keywords: ["통화", "전화"], match: (n) => n.includes("통화") },
    { keywords: ["멤버십", "vip"], match: (n) => n.toLowerCase().includes("멤버십") },
    { keywords: ["스팸", "차단"], match: (n) => n.includes("스팸") },
    { keywords: ["보험", "안심", "가드"], match: (n) => n.includes("가드") || n.includes("안심") },
  ];

  for (const rule of addonKeywordMap) {
    if (rule.keywords.some((kw) => joined.includes(kw))) {
      const idx = addons.findIndex((a) => rule.match(a.name));
      if (idx >= 0) return { index: idx, name: addons[idx].name };
    }
  }

  // Default: first inactive addon
  const inactiveIdx = addons.findIndex((a) => !a.active);
  if (inactiveIdx >= 0) return { index: inactiveIdx, name: addons[inactiveIdx].name };
  return { index: 0, name: addons[0].name };
}

function buildDataAddonSequence(keywords: string[]): ActionSequence {
  const addon = resolveAddonIndex(keywords);

  return {
    steps: [
      {
        elementId: `addon-${addon.index}`,
        action: "click",
        label: `${addon.name} 선택`,
        delayBefore: 400,
        delayAfter: 800,
      },
      {
        elementId: "apply-addon",
        action: "click",
        label: "부가서비스 추가",
        delayBefore: 300,
        delayAfter: 800,
      },
    ],
    dispatches: [
      { type: "DATA_SELECT_ADDON", index: addon.index },
      { type: "DATA_ADD_ADDON" },
    ],
  };
}

// --- Sequence resolution ---

export function getActionSequence(screenType: CrmScreenType, keywords?: string[]): ActionSequence | null {
  const kws = keywords ?? [];
  switch (screenType) {
    case "roaming":
      return buildRoamingSequence(kws);
    case "plan-change":
      return buildPlanChangeSequence(kws);
    case "device-change":
      return buildDeviceChangeSequence(kws);
    case "lost-stolen":
      return buildLostStolenSequence(kws);
    case "cancellation":
      return buildCancellationSequence(kws);
    case "data-addon":
      return buildDataAddonSequence(kws);
    default:
      return null;
  }
}
