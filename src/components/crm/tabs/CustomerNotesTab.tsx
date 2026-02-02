import { CUSTOMER_NOTES } from "@/lib/crm-dummy-data";

export default function CustomerNotesTab() {
  return (
    <div className="p-3 space-y-3 text-xs">
      <div className="text-[11px] text-gray-500 font-medium mb-2">고객 메모</div>
      <div className="space-y-2">
        {CUSTOMER_NOTES.map((note, i) => (
          <div key={i} className="bg-white border rounded p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400">{note.date}</span>
              <span className="text-[10px] text-gray-400">작성자: {note.author}</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{note.content}</p>
          </div>
        ))}
      </div>

      {/* New note form (disabled for demo) */}
      <div className="border-t pt-3">
        <div className="text-[11px] text-gray-500 mb-1.5">새 메모 작성</div>
        <textarea
          disabled
          placeholder="메모를 입력하세요..."
          className="w-full border rounded p-2 text-xs text-gray-600 bg-gray-50 resize-none h-16 disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <button
          disabled
          className="mt-1 px-3 py-1 bg-gray-300 text-white rounded text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          저장
        </button>
      </div>
    </div>
  );
}
