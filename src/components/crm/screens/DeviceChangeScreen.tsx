import { DEVICE_DATA, CUSTOMER } from "@/lib/crm-dummy-data";
import type { CrmState, CrmAction } from "@/types/crm";

interface DeviceChangeScreenProps {
  state?: CrmState["deviceChange"];
  dispatch?: (action: CrmAction) => void;
  highlightedElement?: string | null;
}

export default function DeviceChangeScreen({
  state,
  dispatch,
  highlightedElement,
}: DeviceChangeScreenProps) {
  const device = state ?? {
    selectedOption: null,
    selectedDevice: null,
    changeStatus: "미변경",
  };
  const isComplete = device.changeStatus === "개통완료";

  return (
    <div className="p-3 space-y-3 text-xs">
      {/* Current device info */}
      <div className="bg-gray-50 rounded p-2.5">
        <div className="text-[11px] text-gray-500 mb-1">현재 기기</div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-sm">{DEVICE_DATA.current.name}</span>
            <div className="flex gap-3 mt-1 text-gray-600">
              <span>IMEI: {CUSTOMER.imei}</span>
              <span>개통일: {DEVICE_DATA.current.startDate}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-gray-900">{DEVICE_DATA.current.installment}</div>
            <div className="text-[10px] text-orange-600">잔여 {DEVICE_DATA.current.remaining}</div>
          </div>
        </div>
      </div>

      {/* Contract options */}
      <div className="flex gap-2">
        {DEVICE_DATA.options.map((opt) => (
          <button
            key={opt}
            data-crm-id={`option-${opt}`}
            onClick={() => dispatch?.({ type: "DEVICE_SELECT_OPTION", option: opt })}
            disabled={!dispatch || isComplete}
            className={`flex items-center gap-1.5 border rounded px-2.5 py-1.5 transition-all ${
              device.selectedOption === opt
                ? "border-[#E4002B] bg-red-50 text-[#E4002B]"
                : "border-gray-200 bg-white text-gray-600"
            } ${!dispatch || isComplete ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-gray-50"} ${
              highlightedElement === `option-${opt}` ? "crm-highlight" : ""
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                device.selectedOption === opt ? "border-[#E4002B]" : "border-gray-300"
              }`}
            >
              {device.selectedOption === opt && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E4002B]" />
              )}
            </span>
            <span>{opt}</span>
          </button>
        ))}
      </div>

      {/* Available devices */}
      <div>
        <div className="text-[11px] text-gray-500 mb-1.5">변경 가능 기기</div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-[11px] text-gray-600">
              <th className="text-left p-2 font-medium">기기명</th>
              <th className="text-right p-2 font-medium">출고가</th>
              <th className="text-right p-2 font-medium">공시지원금</th>
              <th className="text-right p-2 font-medium">월 할부금</th>
              <th className="text-center p-2 font-medium">개통</th>
            </tr>
          </thead>
          <tbody>
            {DEVICE_DATA.available.map((d, i) => (
              <tr
                key={i}
                data-crm-id={`device-${i}`}
                className={`border-b border-gray-100 transition-all ${
                  device.selectedDevice === i ? "bg-red-50" : ""
                } ${highlightedElement === `device-${i}` ? "crm-highlight" : ""}`}
              >
                <td className="p-2 font-medium">{d.name}</td>
                <td className="p-2 text-right text-gray-600">{d.price}</td>
                <td className="p-2 text-right text-green-700 font-medium">-{d.subsidy}</td>
                <td className="p-2 text-right font-medium">{d.installment}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => dispatch?.({ type: "DEVICE_SELECT", index: i })}
                    disabled={!dispatch || isComplete}
                    className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                      device.selectedDevice === i
                        ? "bg-[#E4002B] text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    } ${!dispatch || isComplete ? "disabled:opacity-50 disabled:cursor-not-allowed" : ""}`}
                  >
                    {device.selectedDevice === i ? "선택됨" : "선택"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Installment calculator */}
      {device.selectedDevice !== null && device.selectedOption && (
        <div className="bg-blue-50 border border-blue-200 rounded p-2.5">
          <div className="text-[11px] text-blue-600 mb-1">할부 계산</div>
          <div className="flex justify-between text-gray-700">
            <span>선택: {DEVICE_DATA.available[device.selectedDevice].name}</span>
            <span className="font-bold">
              {device.selectedOption === "공시지원금"
                ? DEVICE_DATA.available[device.selectedDevice].installment
                : `약 ${Math.round(parseInt(DEVICE_DATA.available[device.selectedDevice].installment.replace(/[^0-9]/g, "")) * 0.75).toLocaleString()}원/월`}
            </span>
          </div>
        </div>
      )}

      {/* Apply button */}
      <button
        data-crm-id="apply-device"
        onClick={() => dispatch?.({ type: "DEVICE_OPEN" })}
        disabled={!dispatch || isComplete || device.selectedDevice === null}
        className={`w-full py-2 rounded font-bold text-xs transition-all ${
          highlightedElement === "apply-device" ? "crm-highlight" : ""
        } ${
          isComplete
            ? "bg-green-500 text-white"
            : "bg-[#E4002B] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
      >
        {isComplete ? "개통 완료" : "기기변경 개통"}
      </button>

      <div className="bg-gray-50 border border-gray-200 rounded p-2 text-[11px] text-gray-500">
        * T안심보험 가입 안내: 기기변경 시 보험 가입을 권장합니다. (월 9,900원)
      </div>
    </div>
  );
}
