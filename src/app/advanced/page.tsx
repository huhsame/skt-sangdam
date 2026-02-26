"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearch } from "@/hooks/useSearch";
import { useRealtimeTranscription } from "@/hooks/useRealtimeTranscription";
import { useAiSuggestion } from "@/hooks/useAiSuggestion";
import { useCrmState } from "@/hooks/useCrmState";
import { useCrmAutoAction } from "@/hooks/useCrmAutoAction";
import { determineCrmScreen } from "@/lib/crm-screen-mapper";
import { detectConfirm } from "@/lib/confirm-detector";
import SearchInput from "@/components/SearchInput";
import TranscriptionPanel from "@/components/TranscriptionPanel";
import AiSuggestionPanel from "@/components/AiSuggestionPanel";
import CrmAdvancedPanel from "@/components/crm/CrmAdvancedPanel";
import type { CrmScreenType } from "@/types/crm";

type Phase = "idle" | "searching" | "responding" | "awaiting-confirm" | "executing" | "done";

export default function AdvancedPage() {
  const {
    query,
    setQuery,
    results,
    keywords,
    isLoading,
    error,
    handleQueryChange,
    triggerSearch,
  } = useSearch();
  const [crmScreenType, setCrmScreenType] = useState<CrmScreenType>("data-addon");
  const [phase, setPhase] = useState<Phase>("idle");

  const autoSelectRef = useRef(false);
  const pendingScreenRef = useRef<CrmScreenType>("data-addon");
  const pendingKeywordsRef = useRef<string[]>([]);

  // AI suggestion
  const {
    suggestion,
    isGenerating,
    isSpeaking,
    error: aiError,
    autoSpeakEnabled,
    setAutoSpeakEnabled,
    generate,
    speak,
    stopSpeaking,
    reset: resetAi,
  } = useAiSuggestion();

  // CRM state
  const {
    state: crmState,
    dispatch: crmDispatch,
    highlightedElement,
    setHighlightedElement,
    resetState: resetCrm,
  } = useCrmState();

  // CRM auto action
  const {
    isRunning: isAutoRunning,
    currentStepLabel,
    completedSteps,
    run: runAutoAction,
    stop: stopAutoAction,
  } = useCrmAutoAction({
    dispatch: crmDispatch,
    setHighlightedElement,
  });

  // Execute CRM action (called on confirm or manual button)
  const executeCrmAction = useCallback(() => {
    setPhase("executing");
    runAutoAction(pendingScreenRef.current, pendingKeywordsRef.current);
  }, [runAutoAction]);

  // Handle voice utterance -> branch by phase
  const handleUtteranceComplete = useCallback(
    (text: string) => {
      if (phase === "awaiting-confirm") {
        const result = detectConfirm(text);
        if (result === "yes") {
          executeCrmAction();
        } else if (result === "no") {
          setPhase("done");
          speak("알겠습니다. 다른 문의사항이 있으시면 말씀해주세요.");
        } else {
          // Unknown — treat as new query
          setQuery(text);
          triggerSearch(text);
          autoSelectRef.current = true;
          setPhase("searching");
        }
      } else {
        // Default: new search
        setQuery(text);
        triggerSearch(text);
        autoSelectRef.current = true;
        setPhase("searching");
      }
    },
    [phase, executeCrmAction, speak, setQuery, triggerSearch]
  );

  // When results arrive, trigger AI (but NOT CRM)
  useEffect(() => {
    if (autoSelectRef.current && results.length > 0) {
      autoSelectRef.current = false;

      // Reset previous actions
      stopAutoAction();
      resetCrm();

      // Determine screen type
      const screen = determineCrmScreen(keywords);
      setCrmScreenType(screen);
      pendingScreenRef.current = screen;
      pendingKeywordsRef.current = keywords;

      setPhase("responding");

      // Generate AI suggestion with onSpeakEnd callback
      const contexts = results.slice(0, 3).map((r) => r.content);
      generate(
        {
          query,
          contexts,
          keywords,
          screenType: screen,
        },
        () => {
          // TTS playback finished -> await customer confirmation
          setPhase("awaiting-confirm");
        }
      );
    }
  }, [results, keywords, query, generate, stopAutoAction, resetCrm]);

  const { status, transcripts, currentDelta, error: transcriptionError, start, stop } =
    useRealtimeTranscription(handleUtteranceComplete);

  // Manual search also triggers AI
  const handleManualSearch = useCallback(
    (value: string) => {
      handleQueryChange(value);
      // Set autoSelect for next results
      if (value.trim()) {
        autoSelectRef.current = true;
        setPhase("searching");
      }
    },
    [handleQueryChange]
  );

  // Track auto-action completion -> done
  useEffect(() => {
    if (phase === "executing" && !isAutoRunning && completedSteps.length > 0) {
      setPhase("done");
    }
  }, [phase, isAutoRunning, completedSteps]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#E4002B] text-white px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold tracking-tight">통신사 AI 상담 시스템</h1>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Advanced</span>
        </div>
        <div className="flex items-center gap-3">
          {isSpeaking && (
            <span className="text-xs flex items-center gap-1.5">
              <span className="ai-speaking-wave flex items-end h-3">
                <span className="!bg-white" />
                <span className="!bg-white" />
                <span className="!bg-white" />
                <span className="!bg-white" />
                <span className="!bg-white" />
              </span>
              AI 음성 응대중
            </span>
          )}
          {phase === "awaiting-confirm" && (
            <span className="text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              고객 응답 대기
            </span>
          )}
          <span className="text-xs opacity-75">AI 자동 응대 + CRM 자동 조작</span>
        </div>
      </header>

      {/* Main: 2-panel */}
      <main className="flex-1 flex min-h-0">
        {/* Left panel: Transcription + Search input */}
        <div className="w-[380px] border-r border-gray-200 bg-white flex flex-col shrink-0">
          <TranscriptionPanel
            status={status}
            transcripts={transcripts}
            currentDelta={currentDelta}
            error={transcriptionError}
            onStart={start}
            onStop={stop}
          />

          {/* Search input */}
          <div className="p-4 border-b border-gray-200">
            <SearchInput value={query} onChange={handleManualSearch} isLoading={isLoading} />
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          </div>

          {/* AI Suggestion Panel (fills remaining space) */}
          <div className="flex-1 overflow-hidden">
            <AiSuggestionPanel
              suggestion={suggestion}
              isGenerating={isGenerating}
              isSpeaking={isSpeaking}
              error={aiError}
              autoSpeakEnabled={autoSpeakEnabled}
              onToggleAutoSpeak={setAutoSpeakEnabled}
              onSpeak={speak}
              onStopSpeaking={stopSpeaking}
              phase={phase}
              onManualExecute={executeCrmAction}
            />
          </div>
        </div>

        {/* Right panel: CRM only */}
        <div className="flex-1 min-h-0">
          <CrmAdvancedPanel
            keywords={keywords}
            screenType={crmScreenType}
            onScreenChange={setCrmScreenType}
            state={crmState}
            dispatch={crmDispatch}
            highlightedElement={highlightedElement}
            isAutoRunning={isAutoRunning}
            currentStepLabel={currentStepLabel}
            completedSteps={completedSteps}
          />
        </div>
      </main>
    </div>
  );
}
