import { COUNSEL_HISTORY } from "@/lib/crm-dummy-data";

export default function CounselHistoryTab() {
  return (
    <div className="p-3 space-y-2 text-xs">
      <div className="text-[11px] text-gray-500 font-medium mb-2">상담 이력 ({COUNSEL_HISTORY.length}건)</div>
      <div className="space-y-2">
        {COUNSEL_HISTORY.map((item, i) => (
          <div key={i} className="bg-white border rounded p-2.5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{item.type}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  item.channel === "전화"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {item.channel}
                </span>
              </div>
              <span className="text-[10px] text-gray-400">
                {item.date} {item.time}
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">{item.summary}</p>
            <div className="mt-1 text-[10px] text-gray-400">담당: {item.agent}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
