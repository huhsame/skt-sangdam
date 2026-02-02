import { PLAN_DATA, CUSTOMER } from "@/lib/crm-dummy-data";
import type { CrmState, CrmAction } from "@/types/crm";

interface PlanChangeScreenProps {
  state?: CrmState["planChange"];
  dispatch?: (action: CrmAction) => void;
  highlightedElement?: string | null;
}

export default function PlanChangeScreen({
  state,
  dispatch,
  highlightedElement,
}: PlanChangeScreenProps) {
  const plan = state ?? { selectedPlan: null, changeStatus: "미변경" };
  const isComplete = plan.changeStatus === "변경완료";

  return (
    <div className="p-3 space-y-3 text-xs">
      {/* Current plan */}
      <div className="bg-blue-50 border border-blue-200 rounded p-2.5">
        <div className="text-[11px] text-blue-600 mb-1">현재 요금제</div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-sm text-gray-900">{PLAN_DATA.current.name}</span>
            <div className="flex gap-3 mt-1 text-gray-600">
              <span>데이터 {PLAN_DATA.current.data}</span>
              <span>통화 {PLAN_DATA.current.call}</span>
              <span>문자 {PLAN_DATA.current.message}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">{PLAN_DATA.current.price}</div>
            <div className="text-[10px] text-gray-400">월 요금</div>
          </div>
        </div>
      </div>

      {/* Usage recommendation */}
      <div className="bg-violet-50 border border-violet-200 rounded p-2 text-[11px] text-violet-800">
        현재 데이터 사용량 {CUSTOMER.dataUsed}/{CUSTOMER.dataTotal} — 매월 초과 경향이 있어 상위 요금제를 권장합니다.
      </div>

      {/* Available plans */}
      <div>
        <div className="text-[11px] text-gray-500 mb-1.5">변경 가능 요금제</div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-[11px] text-gray-600">
              <th className="text-left p-2 font-medium">요금제</th>
              <th className="text-center p-2 font-medium">데이터</th>
              <th className="text-center p-2 font-medium">통화</th>
              <th className="text-right p-2 font-medium">월 요금</th>
              <th className="text-right p-2 font-medium">차액</th>
              <th className="text-center p-2 font-medium">변경</th>
            </tr>
          </thead>
          <tbody>
            {PLAN_DATA.available.map((p, i) => (
              <tr
                key={i}
                data-crm-id={`plan-${i}`}
                className={`border-b border-gray-100 transition-all ${
                  plan.selectedPlan === i ? "bg-red-50" : ""
                } ${highlightedElement === `plan-${i}` ? "crm-highlight" : ""}`}
              >
                <td className="p-2 font-medium">{p.name}</td>
                <td className="p-2 text-center text-gray-600">{p.data}</td>
                <td className="p-2 text-center text-gray-600">{p.call}</td>
                <td className="p-2 text-right font-medium">{p.price}</td>
                <td className={`p-2 text-right font-medium ${p.diff.startsWith("+") ? "text-red-600" : "text-blue-600"}`}>
                  {p.diff}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => dispatch?.({ type: "PLAN_SELECT", index: i })}
                    disabled={!dispatch || isComplete}
                    className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                      plan.selectedPlan === i
                        ? "bg-[#E4002B] text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    } ${!dispatch || isComplete ? "disabled:opacity-50 disabled:cursor-not-allowed" : ""}`}
                  >
                    {plan.selectedPlan === i ? "선택됨" : "선택"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Apply button */}
      <button
        data-crm-id="apply-plan"
        onClick={() => dispatch?.({ type: "PLAN_CHANGE" })}
        disabled={!dispatch || isComplete || plan.selectedPlan === null}
        className={`w-full py-2 rounded font-bold text-xs transition-all ${
          highlightedElement === "apply-plan" ? "crm-highlight" : ""
        } ${
          isComplete
            ? "bg-green-500 text-white"
            : "bg-[#E4002B] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
      >
        {isComplete ? "변경 완료" : "요금제 변경"}
      </button>

      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-[11px] text-yellow-800">
        * 약정 잔여기간: {CUSTOMER.contractEnd}까지. 요금제 변경 시 약정 조건이 변경될 수 있습니다.
      </div>
    </div>
  );
}
