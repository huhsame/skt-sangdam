"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearch } from "@/hooks/useSearch";
import { useRealtimeTranscription } from "@/hooks/useRealtimeTranscription";
import SearchInput from "@/components/SearchInput";
import SearchResults from "@/components/SearchResults";
import ContentViewer from "@/components/ContentViewer";
import PdfUploader from "@/components/PdfUploader";
import DocumentList from "@/components/DocumentList";
import TranscriptionPanel from "@/components/TranscriptionPanel";
import CrmDemoPanel from "@/components/crm/CrmDemoPanel";
import type { SearchResult } from "@/types/manual";

export default function Home() {
  const { query, setQuery, results, keywords, isLoading, error, handleQueryChange, triggerSearch } =
    useSearch();
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [uploadCount, setUploadCount] = useState(0);

  // Track if we should auto-select on next results change
  const autoSelectRef = useRef(false);

  const handleSelect = (result: SearchResult) => {
    setSelected(result);
  };

  const handleUploadComplete = useCallback(() => {
    setUploadCount((c) => c + 1);
  }, []);

  const handleUtteranceComplete = useCallback(
    (text: string) => {
      setQuery(text);
      triggerSearch(text);
      autoSelectRef.current = true;
    },
    [setQuery, triggerSearch]
  );

  // Auto-select first result when results arrive from voice search
  useEffect(() => {
    if (autoSelectRef.current && results.length > 0) {
      setSelected(results[0]);
      autoSelectRef.current = false;
    }
  }, [results]);

  const { status, transcripts, currentDelta, error: transcriptionError, start, stop } =
    useRealtimeTranscription(handleUtteranceComplete);

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <header className="bg-[#E6007E] text-white px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold tracking-tight">LG U+ 상담 매뉴얼</h1>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">v2026.02</span>
        </div>
        <span className="text-xs opacity-75">시맨틱 검색 시스템</span>
      </header>

      {/* 메인 영역: 2패널 */}
      <main className="flex-1 flex min-h-0">
        {/* 좌측 패널: 자막 + 업로드 + 검색 */}
        <div className="w-[380px] border-r border-gray-200 bg-white flex flex-col shrink-0">
          <TranscriptionPanel
            status={status}
            transcripts={transcripts}
            currentDelta={currentDelta}
            error={transcriptionError}
            onStart={start}
            onStop={stop}
          />

          {/* PDF 업로드 */}
          <PdfUploader onComplete={handleUploadComplete} />

          {/* 업로드된 문서 목록 */}
          <DocumentList refreshKey={uploadCount} onDeleted={() => setUploadCount((c) => c + 1)} />

          {/* 검색 입력 */}
          <div className="p-4 border-b border-gray-200">
            <SearchInput value={query} onChange={handleQueryChange} isLoading={isLoading} />
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            {uploadCount > 0 && !query.trim() && (
              <p className="text-xs text-green-600 mt-2">
                {uploadCount}개 문서 업로드 완료 - 검색해보세요
              </p>
            )}
          </div>

          {/* 검색 결과 */}
          <div className="flex-1 overflow-y-auto">
            {!query.trim() ? (
              <div className="p-6 text-center text-gray-400">
                <p className="text-sm">고객 문의를 입력하면</p>
                <p className="text-sm">관련 매뉴얼을 자동으로 찾아드립니다</p>
                <div className="mt-4 space-y-2 text-xs text-gray-300">
                  <p>&ldquo;데이터가 느려요&rdquo;</p>
                  <p>&ldquo;외국 가는데 폰 돼요?&rdquo;</p>
                  <p>&ldquo;이번 달 요금 왜 이래&rdquo;</p>
                  <p>&ldquo;번호 바꾸고 싶어요&rdquo;</p>
                  <p>&ldquo;폰 잃어버렸어요&rdquo;</p>
                </div>
              </div>
            ) : results.length === 0 && !isLoading ? (
              <div className="p-6 text-center text-gray-400">
                <p className="text-sm">검색 결과가 없습니다</p>
              </div>
            ) : (
              <SearchResults
                results={results}
                selectedId={selected?.id ?? null}
                onSelect={handleSelect}
              />
            )}
          </div>
        </div>

        {/* 우측 패널: 매뉴얼(상단 55%) + CRM(하단 45%) */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="h-[55%] border-b border-gray-200 bg-white overflow-hidden">
            <ContentViewer section={selected} />
          </div>
          <div className="h-[45%] overflow-hidden">
            <CrmDemoPanel keywords={keywords} />
          </div>
        </div>
      </main>
    </div>
  );
}
