import { DATA_ADDON_DATA, DAILY_DATA_USAGE } from "@/lib/crm-dummy-data";
import type { CrmState, CrmAction } from "@/types/crm";

interface DataAddonScreenProps {
  state?: CrmState["dataAddon"];
  dispatch?: (action: CrmAction) => void;
  highlightedElement?: string | null;
}

export default function DataAddonScreen({
  state,
  dispatch,
  highlightedElement,
}: DataAddonScreenProps) {
  const { usage } = DATA_ADDON_DATA;
  const pct = Math.round((usage.used / usage.total) * 100);
  const addons = state?.addons ?? DATA_ADDON_DATA.addons.map((a) => ({ name: a.name, active: a.active }));
  const selectedAddon = state?.selectedAddon ?? null;

  const maxUsage = Math.max(...DAILY_DATA_USAGE.map((d) => d.used));

  return (
    <div className="p-3 space-y-3 text-xs">
      {/* Data usage */}
      <div className="bg-gray-50 rounded p-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-gray-500">데이터 사용량</span>
          <span className="text-[10px] text-gray-400">갱신일: {usage.resetDate}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E4002B] to-[#ff4d6a] rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="font-bold">
            {usage.used}
            {usage.unit} 사용
          </span>
          <span className="text-gray-500">
            {usage.total}
            {usage.unit} 중
          </span>
        </div>
        <div className="mt-1 text-[11px] text-gray-500">
          잔여:{" "}
          <span className="font-bold text-blue-700">
            {(usage.total - usage.used).toFixed(1)}
            {usage.unit}
          </span>
        </div>
      </div>

      {/* Daily usage chart */}
      <div>
        <div className="text-[11px] text-gray-500 mb-1.5">최근 7일 사용량</div>
        <div className="flex items-end gap-1 h-16 bg-gray-50 rounded p-2">
          {DAILY_DATA_USAGE.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className="w-full bg-gradient-to-t from-[#E4002B] to-[#ff4d6a] rounded-t"
                style={{ height: `${(d.used / maxUsage) * 100}%` }}
                title={`${d.used}GB`}
              />
              <span className="text-[9px] text-gray-400">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-gray-400 mt-0.5 px-2">
          <span>0GB</span>
          <span>{maxUsage.toFixed(1)}GB</span>
        </div>
      </div>

      {/* Add-on services */}
      <div>
        <div className="text-[11px] text-gray-500 mb-1.5">부가서비스</div>
        <div className="space-y-1">
          {DATA_ADDON_DATA.addons.map((originalAddon, i) => {
            const currentActive = addons[i]?.active ?? originalAddon.active;
            const isSelected = selectedAddon === i;

            return (
              <div
                key={i}
                data-crm-id={`addon-${i}`}
                className={`flex items-center justify-between bg-white border rounded px-2.5 py-2 transition-all ${
                  isSelected ? "border-[#E4002B] bg-red-50" : ""
                } ${highlightedElement === `addon-${i}` ? "crm-highlight" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      currentActive ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span className="font-medium">{originalAddon.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{originalAddon.price}</span>
                  {currentActive ? (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px]">
                      사용중
                    </span>
                  ) : (
                    <button
                      onClick={() => dispatch?.({ type: "DATA_SELECT_ADDON", index: i })}
                      disabled={!dispatch}
                      className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                        isSelected
                          ? "bg-[#E4002B] text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      } ${!dispatch ? "disabled:opacity-50 disabled:cursor-not-allowed" : ""}`}
                    >
                      {isSelected ? "선택됨" : "추가"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Apply button */}
      {selectedAddon !== null && (
        <button
          data-crm-id="apply-addon"
          onClick={() => dispatch?.({ type: "DATA_ADD_ADDON" })}
          disabled={!dispatch}
          className={`w-full py-2 bg-[#E4002B] text-white rounded font-bold text-xs transition-all ${
            highlightedElement === "apply-addon" ? "crm-highlight" : ""
          } ${!dispatch ? "disabled:opacity-50 disabled:cursor-not-allowed" : ""}`}
        >
          부가서비스 추가
        </button>
      )}
    </div>
  );
}
