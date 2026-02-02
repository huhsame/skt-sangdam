"use client";

type Phase = "idle" | "searching" | "responding" | "awaiting-confirm" | "executing" | "done";

interface AiSuggestionPanelProps {
  suggestion: string;
  isGenerating: boolean;
  isSpeaking: boolean;
  error: string | null;
  autoSpeakEnabled: boolean;
  onToggleAutoSpeak: (v: boolean) => void;
  onSpeak: (text: string) => void;
  onStopSpeaking: () => void;
  phase?: Phase;
  onManualExecute?: () => void;
}

export default function AiSuggestionPanel({
  suggestion,
  isGenerating,
  isSpeaking,
  error,
  autoSpeakEnabled,
  onToggleAutoSpeak,
  onSpeak,
  onStopSpeaking,
  phase = "idle",
  onManualExecute,
}: AiSuggestionPanelProps) {
  const handleCopy = () => {
    if (suggestion) navigator.clipboard.writeText(suggestion);
  };

  return (
    <div className="h-full flex flex-col bg-violet-50/50">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-violet-200 bg-violet-50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-violet-800">AI 응대</span>
          {isGenerating && (
            <span className="text-[10px] text-violet-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              생성중
            </span>
          )}
          {isSpeaking && (
            <span className="ai-speaking-wave flex items-end h-4">
              <span /><span /><span /><span /><span />
            </span>
          )}
          {phase === "awaiting-confirm" && !isSpeaking && (
            <span className="text-[10px] text-amber-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              고객 응답 대기중
            </span>
          )}
          {phase === "executing" && (
            <span className="text-[10px] text-blue-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              CRM 처리중
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-[10px] text-violet-600 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSpeakEnabled}
              onChange={(e) => onToggleAutoSpeak(e.target.checked)}
              className="w-3 h-3 accent-violet-600"
            />
            자동재생
          </label>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : suggestion ? (
          <p className={`text-xs text-gray-800 leading-relaxed whitespace-pre-wrap ${isGenerating ? "ai-text-cursor" : ""}`}>
            {suggestion}
          </p>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-xs">고객 문의 시 AI 응대 스크립트가 생성됩니다</p>
          </div>
        )}

        {/* Awaiting confirm indicator */}
        {phase === "awaiting-confirm" && !isSpeaking && suggestion && (
          <div className="mt-3 px-2 py-2 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-[11px] text-amber-700 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              고객의 동의 응답을 기다리고 있습니다...
            </p>
            <p className="text-[10px] text-amber-600 mt-1 ml-3.5">
              &quot;네&quot; / &quot;해주세요&quot; → CRM 자동 실행 | &quot;아니요&quot; → 대기
            </p>
          </div>
        )}
      </div>

      {/* Footer: actions */}
      {suggestion && !isGenerating && (
        <div className="flex items-center gap-2 px-3 py-1.5 border-t border-violet-200 bg-violet-50/80">
          {isSpeaking ? (
            <button
              onClick={onStopSpeaking}
              className="px-2 py-0.5 text-[10px] bg-red-500 text-white rounded hover:bg-red-600"
            >
              재생 중지
            </button>
          ) : (
            <button
              onClick={() => onSpeak(suggestion)}
              className="px-2 py-0.5 text-[10px] bg-violet-600 text-white rounded hover:bg-violet-700"
            >
              다시 재생
            </button>
          )}
          <button
            onClick={handleCopy}
            className="px-2 py-0.5 text-[10px] border border-violet-300 text-violet-700 rounded hover:bg-violet-100"
          >
            복사
          </button>
          {(phase === "awaiting-confirm" || phase === "done") && onManualExecute && (
            <button
              onClick={onManualExecute}
              className="ml-auto px-2.5 py-0.5 text-[10px] bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              직접 실행
            </button>
          )}
        </div>
      )}
    </div>
  );
}
