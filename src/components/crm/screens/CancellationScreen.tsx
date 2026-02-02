import { CANCELLATION_DATA, CUSTOMER, RETENTION_OFFERS } from "@/lib/crm-dummy-data";
import type { CrmState, CrmAction } from "@/types/crm";

interface CancellationScreenProps {
  state?: CrmState["cancellation"];
  dispatch?: (action: CrmAction) => void;
  highlightedElement?: string | null;
}

export default function CancellationScreen({
  state,
  dispatch,
  highlightedElement,
}: CancellationScreenProps) {
  const cancel = state ?? { selectedReason: null, cancelStatus: "미처리" };
  const isComplete = cancel.cancelStatus === "해지완료";

  return (
    <div className="p-3 space-y-3 text-xs">
      {/* Warning */}
      <div className="bg-red-50 border border-red-300 rounded p-2.5">
        <div className="flex items-center gap-2 text-red-700 font-bold">
          <span>&#x26A0;</span>
          <span>해지 처리 - 고객에게 위약금 및 약정 잔여 기간을 반드시 안내하세요</span>
        </div>
      </div>

      {/* Retention offers */}
      <div className="bg-green-50 border border-green-200 rounded p-2.5">
        <div className="text-[11px] text-green-700 font-bold mb-1.5">리텐션 혜택 제안</div>
        <div className="space-y-1.5">
          {RETENTION_OFFERS.map((offer, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-800">{offer.name}</span>
                <span className="text-gray-500 ml-1">- {offer.desc}</span>
              </div>
              <span className="text-green-700 font-medium text-[10px]">{offer.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contract info */}
      <div className="bg-gray-50 rounded p-2.5">
        <div className="text-[11px] text-gray-500 mb-1.5">약정 정보</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-[10px] text-gray-400">약정 유형</div>
            <div className="font-medium">{CANCELLATION_DATA.contractType}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400">약정 기간</div>
            <div className="font-medium">
              {CANCELLATION_DATA.contractStart} ~ {CANCELLATION_DATA.contractEnd}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400">잔여 개월</div>
            <div className="font-bold text-orange-600">
              {CANCELLATION_DATA.remainingMonths}개월
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400">현재 요금제</div>
            <div className="font-medium">{CUSTOMER.plan}</div>
          </div>
        </div>
      </div>

      {/* Penalty calculation */}
      <div className="border border-red-200 rounded p-2.5">
        <div className="text-[11px] text-gray-500 mb-1.5">위약금 산출</div>
        <div className="space-y-1.5">
          {CANCELLATION_DATA.penaltyBreakdown.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-gray-600">{item.item}</span>
              <span className="font-medium">{item.amount}</span>
            </div>
          ))}
          <div className="border-t border-red-200 pt-1.5 flex justify-between">
            <span className="font-bold text-red-700">총 위약금</span>
            <span className="font-bold text-red-700 text-sm">
              {CANCELLATION_DATA.penalty}
            </span>
          </div>
        </div>
      </div>

      {/* Cancellation reason */}
      <div>
        <div className="text-[11px] text-gray-500 mb-1.5">해지 사유</div>
        <select
          data-crm-id="reason-타사 이동"
          value={cancel.selectedReason ?? ""}
          onChange={(e) =>
            dispatch?.({ type: "CANCEL_SELECT_REASON", reason: e.target.value })
          }
          disabled={!dispatch || isComplete}
          className={`w-full border rounded p-2 text-gray-600 bg-white transition-all ${
            !dispatch || isComplete
              ? "disabled:opacity-70 disabled:cursor-not-allowed"
              : ""
          } ${highlightedElement === "reason-타사 이동" ? "crm-highlight" : ""}`}
        >
          <option value="">사유를 선택하세요</option>
          {CANCELLATION_DATA.reasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Cancel button */}
      <button
        data-crm-id="apply-cancel"
        onClick={() => dispatch?.({ type: "CANCEL_PROCESS" })}
        disabled={!dispatch || isComplete || !cancel.selectedReason}
        className={`w-full py-2 rounded font-bold transition-all ${
          highlightedElement === "apply-cancel" ? "crm-highlight" : ""
        } ${
          isComplete
            ? "bg-gray-500 text-white"
            : "bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
      >
        {isComplete ? "해지 완료" : "해지 처리"}
      </button>
    </div>
  );
}
