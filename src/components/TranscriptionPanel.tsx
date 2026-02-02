"use client";

import { useEffect, useRef } from "react";
import type { TranscriptionStatus, TranscriptEntry } from "@/types/transcription";

interface TranscriptionPanelProps {
  status: TranscriptionStatus;
  transcripts: TranscriptEntry[];
  currentDelta: string;
  error: string | null;
  onStart: () => void;
  onStop: () => void;
}

const STATUS_LABELS: Record<TranscriptionStatus, string> = {
  idle: "대기 중",
  connecting: "연결 중...",
  listening: "듣는 중",
  speaking: "발화 감지",
  error: "오류",
};

const STATUS_COLORS: Record<TranscriptionStatus, string> = {
  idle: "bg-gray-400",
  connecting: "bg-yellow-400 animate-pulse",
  listening: "bg-green-400 animate-pulse",
  speaking: "bg-red-500 animate-pulse",
  error: "bg-red-600",
};

export default function TranscriptionPanel({
  status,
  transcripts,
  currentDelta,
  error,
  onStart,
  onStop,
}: TranscriptionPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isActive = status !== "idle" && status !== "error";

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts, currentDelta]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-900">실시간 자막</h2>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`inline-block w-2 h-2 rounded-full ${STATUS_COLORS[status]}`} />
              {STATUS_LABELS[status]}
            </span>
          </div>
        </div>

        <button
          onClick={isActive ? onStop : onStart}
          disabled={status === "connecting"}
          className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
            status === "connecting"
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : isActive
                ? "bg-gray-800 hover:bg-gray-900 text-white"
                : "bg-[#E4002B] hover:bg-[#C00025] text-white"
          }`}
        >
          {status === "connecting" ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              연결 중...
            </span>
          ) : isActive ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              음성 인식 중지
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
              음성 인식 시작
            </span>
          )}
        </button>

        {error && (
          <p className="mt-2 text-xs text-red-500">{error}</p>
        )}
      </div>

      {/* Transcript area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {transcripts.length === 0 && !currentDelta && (
          <div className="text-center text-gray-400 mt-8">
            <svg className="mx-auto h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 19v2m0 0h-2m2 0h2" />
            </svg>
            <p className="text-xs">마이크를 켜고</p>
            <p className="text-xs">고객 음성을 인식하세요</p>
          </div>
        )}

        {/* Completed transcripts */}
        {transcripts.map((entry) => (
          <div key={entry.id} className="group">
            <p className="text-sm text-gray-800 leading-relaxed">{entry.text}</p>
            <p className="text-[10px] text-gray-300 mt-0.5">
              {new Date(entry.timestamp).toLocaleTimeString("ko-KR")}
            </p>
          </div>
        ))}

        {/* Current streaming delta */}
        {currentDelta && (
          <div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {currentDelta}
              <span className="transcript-cursor" />
            </p>
          </div>
        )}
      </div>

      {/* Footer stats */}
      {transcripts.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 text-[10px] text-gray-400 flex justify-between">
          <span>{transcripts.length}개 발화</span>
          <button
            onClick={() => {
              /* no-op for now; could clear transcripts */
            }}
            className="hover:text-gray-600"
          >
            기록 지우기
          </button>
        </div>
      )}
    </div>
  );
}
