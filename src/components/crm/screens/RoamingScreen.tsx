import { ROAMING_DATA, CUSTOMER, ROAMING_HISTORY } from "@/lib/crm-dummy-data";
import type { CrmState, CrmAction } from "@/types/crm";

interface RoamingScreenProps {
  state?: CrmState["roaming"];
  dispatch?: (action: CrmAction) => void;
  highlightedElement?: string | null;
}

export default function RoamingScreen({
  state,
  dispatch,
  highlightedElement,
}: RoamingScreenProps) {
  const roaming = state ?? {
    currentStatus: ROAMING_DATA.currentStatus,
    selectedRegion: null,
    selectedProduct: null,
  };

  const isComplete = roaming.currentStatus === "신청완료";

  return (
    <div className="p-3 space-y-3 text-xs">
      {/* Current roaming status */}
      <div className="flex items-center justify-between bg-gray-50 rounded p-2.5">
        <div>
          <span className="text-gray-500">로밍 상태</span>
          <span
            className={`ml-2 font-bold ${
              isComplete ? "text-green-600" : "text-red-600"
            } ${isComplete ? "crm-status-changed" : ""}`}
          >
            {roaming.currentStatus}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">기기</span>
          <span className="font-medium">{CUSTOMER.device}</span>
        </div>
      </div>

      {/* Region selection */}
      <div>
        <div className="text-[11px] text-gray-500 mb-1.5">여행 지역</div>
        <div className="flex flex-wrap gap-1.5">
          {ROAMING_DATA.regions.map((r) => (
            <button
              key={r}
              data-crm-id={`region-${r}`}
              onClick={() => dispatch?.({ type: "ROAMING_SELECT_REGION", region: r })}
              disabled={!dispatch}
              className={`px-2.5 py-1 rounded border text-[11px] transition-all ${
                roaming.selectedRegion === r
                  ? "border-[#E4002B] bg-[#E4002B] text-white"
                  : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
              } ${!dispatch ? "disabled:opacity-70 disabled:cursor-not-allowed" : ""} ${
                highlightedElement === `region-${r}` ? "crm-highlight" : ""
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Roaming products table */}
      <div>
        <div className="text-[11px] text-gray-500 mb-1.5">로밍 상품</div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-[11px] text-gray-600">
              <th className="text-left p-2 font-medium">상품명</th>
              <th className="text-left p-2 font-medium">지역</th>
              <th className="text-right p-2 font-medium">요금</th>
              <th className="text-right p-2 font-medium">데이터</th>
              <th className="text-center p-2 font-medium">신청</th>
            </tr>
          </thead>
          <tbody>
            {ROAMING_DATA.products.map((p, i) => (
              <tr
                key={i}
                data-crm-id={`product-${i}`}
                className={`border-b border-gray-100 transition-all ${
                  roaming.selectedProduct === i ? "bg-red-50" : ""
                } ${highlightedElement === `product-${i}` ? "crm-highlight" : ""}`}
              >
                <td className="p-2 font-medium">{p.name}</td>
                <td className="p-2 text-gray-600">{p.region}</td>
                <td className="p-2 text-right text-blue-700 font-medium">{p.price}</td>
                <td className="p-2 text-right text-gray-600">{p.data}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => dispatch?.({ type: "ROAMING_SELECT_PRODUCT", index: i })}
                    disabled={!dispatch || isComplete}
                    className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                      roaming.selectedProduct === i
                        ? "bg-[#E4002B] text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    } ${!dispatch || isComplete ? "disabled:opacity-50 disabled:cursor-not-allowed" : ""}`}
                  >
                    {roaming.selectedProduct === i ? "선택됨" : "선택"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Apply button */}
      <button
        data-crm-id="apply-roaming"
        onClick={() => dispatch?.({ type: "ROAMING_APPLY" })}
        disabled={!dispatch || isComplete || roaming.selectedProduct === null}
        className={`w-full py-2 rounded font-bold text-xs transition-all ${
          highlightedElement === "apply-roaming" ? "crm-highlight" : ""
        } ${
          isComplete
            ? "bg-green-500 text-white"
            : "bg-[#E4002B] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
      >
        {isComplete ? "신청 완료" : "로밍 신청"}
      </button>

      {/* Roaming history */}
      {ROAMING_HISTORY.length > 0 && (
        <div>
          <div className="text-[11px] text-gray-500 mb-1.5">이전 로밍 이력</div>
          <div className="space-y-1">
            {ROAMING_HISTORY.map((h, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded px-2.5 py-1.5">
                <div>
                  <span className="font-medium">{h.region}</span>
                  <span className="text-gray-400 ml-2">{h.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-600">{h.product}</span>
                  <span className="ml-2 font-medium text-blue-700">{h.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-[11px] text-yellow-800">
        * 로밍 서비스는 출발 전 최소 1시간 전에 신청하시기 바랍니다. 현지 도착 후 자동 활성화됩니다.
      </div>
    </div>
  );
}
