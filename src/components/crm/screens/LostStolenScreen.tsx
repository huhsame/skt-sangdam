import { LOST_STOLEN_DATA, CUSTOMER } from "@/lib/crm-dummy-data";
import type { CrmState, CrmAction } from "@/types/crm";

interface LostStolenScreenProps {
  state?: CrmState["lostStolen"];
  dispatch?: (action: CrmAction) => void;
  highlightedElement?: string | null;
}

export default function LostStolenScreen({
  state,
  dispatch,
  highlightedElement,
}: LostStolenScreenProps) {
  const lost = state ?? {
    deviceStatus: LOST_STOLEN_DATA.deviceStatus,
    selectedOption: null,
  };
  const isSuspended = lost.deviceStatus === "분실정지";

  return (
    <div className="p-3 space-y-3 text-xs">
      {/* Emergency alert */}
      <div className="bg-red-50 border border-red-300 rounded p-2.5">
        <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
          <span>&#x1F6A8;</span>
          <span>분실/도난 접수</span>
        </div>
        <div className="mt-1 text-red-600 text-[11px]">
          긴급 정지 필요 시 즉시 처리하세요. 보험 접수는 정지 후 진행 가능합니다.
        </div>
      </div>

      {/* Device status */}
      <div className="bg-gray-50 rounded p-2.5">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-[10px] text-gray-400">기기</div>
            <div className="font-medium">{CUSTOMER.device}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400">기기 상태</div>
            <div
              className={`font-medium ${
                isSuspended ? "text-red-600 crm-status-changed" : "text-green-600"
              }`}
            >
              {lost.deviceStatus}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400">보험</div>
            <div className="font-medium">{LOST_STOLEN_DATA.insuranceStatus}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400">보험료</div>
            <div className="font-medium">{LOST_STOLEN_DATA.insuranceFee}</div>
          </div>
        </div>
      </div>

      {/* IMEI block info */}
      <div className="bg-orange-50 border border-orange-200 rounded p-2 text-[11px] text-orange-800">
        IMEI: {CUSTOMER.imei} — 정지 처리 시 IMEI 자동 차단되며, 타 USIM 사용이 불가합니다.
      </div>

      {/* Suspension options */}
      <div>
        <div className="text-[11px] text-gray-500 mb-1.5">정지 유형 선택</div>
        <div className="grid grid-cols-2 gap-2">
          {LOST_STOLEN_DATA.options.map((opt) => (
            <button
              key={opt.label}
              data-crm-id={`option-${opt.label}`}
              onClick={() =>
                dispatch?.({ type: "LOST_SELECT_OPTION", option: opt.label })
              }
              disabled={!dispatch || isSuspended}
              className={`p-2.5 rounded border-2 text-left transition-all ${
                lost.selectedOption === opt.label
                  ? "border-[#E4002B] bg-red-50"
                  : opt.color === "red"
                  ? "border-red-300 bg-red-50"
                  : "border-yellow-300 bg-yellow-50"
              } ${!dispatch || isSuspended ? "cursor-not-allowed" : "cursor-pointer"} ${
                highlightedElement === `option-${opt.label}` ? "crm-highlight" : ""
              }`}
            >
              <div
                className={`font-bold ${
                  opt.color === "red" ? "text-red-700" : "text-yellow-700"
                }`}
              >
                {lost.selectedOption === opt.label ? `[선택] ${opt.label}` : opt.label}
              </div>
              <div className="text-[10px] text-gray-600 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent calls */}
      <div>
        <div className="text-[11px] text-gray-500 mb-1.5">최근 통화 기록</div>
        <div className="bg-gray-50 rounded divide-y divide-gray-200">
          {LOST_STOLEN_DATA.recentCalls.map((c, i) => (
            <div key={i} className="flex items-center justify-between px-2.5 py-1.5">
              <span className="text-gray-500">{c.time}</span>
              <span className="font-mono">{c.number}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  c.type === "수신"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {c.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insurance coverage */}
      <div className="bg-blue-50 border border-blue-200 rounded p-2 text-[11px] text-blue-800">
        <div className="font-bold mb-1">T안심보험 보장 내용</div>
        <ul className="space-y-0.5 text-[10px]">
          <li>- 분실/도난: 자기부담금 70,000원 후 보장</li>
          <li>- 파손: 수리비 전액 보장 (연 2회)</li>
          <li>- 침수: 수리비 전액 보장 (연 1회)</li>
        </ul>
      </div>

      {/* Emergency suspend button */}
      <button
        data-crm-id="apply-suspend"
        onClick={() => dispatch?.({ type: "LOST_SUSPEND" })}
        disabled={!dispatch || isSuspended || !lost.selectedOption}
        className={`w-full py-2 rounded font-bold transition-all ${
          highlightedElement === "apply-suspend" ? "crm-highlight" : ""
        } ${
          isSuspended
            ? "bg-orange-500 text-white"
            : "bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
      >
        {isSuspended ? "분실 정지 완료" : "긴급 정지 처리"}
      </button>
    </div>
  );
}
