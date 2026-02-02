"use client";

import { useEffect, useRef } from "react";
import { determineCrmScreen } from "@/lib/crm-screen-mapper";
import type { CrmScreenType, CrmState, CrmAction } from "@/types/crm";
import CrmShell from "./CrmShell";

interface CrmAdvancedPanelProps {
  keywords: string[];
  screenType: CrmScreenType;
  onScreenChange: (type: CrmScreenType) => void;
  state: CrmState;
  dispatch: (action: CrmAction) => void;
  highlightedElement: string | null;
  isAutoRunning: boolean;
  currentStepLabel: string;
  completedSteps: string[];
}

export default function CrmAdvancedPanel({
  keywords,
  screenType,
  onScreenChange,
  state,
  dispatch,
  highlightedElement,
  isAutoRunning,
  currentStepLabel,
  completedSteps,
}: CrmAdvancedPanelProps) {
  const prevKeywordsRef = useRef<string[]>([]);

  // Auto-switch screen based on keywords
  useEffect(() => {
    if (
      keywords.length > 0 &&
      JSON.stringify(keywords) !== JSON.stringify(prevKeywordsRef.current)
    ) {
      const newScreen = determineCrmScreen(keywords);
      onScreenChange(newScreen);
      prevKeywordsRef.current = keywords;
    }
  }, [keywords, onScreenChange]);

  if (keywords.length === 0 && !isAutoRunning && completedSteps.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 text-gray-400">
        <div className="text-center">
          <div className="text-2xl mb-2">&#x1F4CB;</div>
          <p className="text-sm">검색 시 CRM 화면이 표시됩니다</p>
          <p className="text-xs mt-1 text-gray-300">
            AI가 자동으로 화면을 조작합니다
          </p>
        </div>
      </div>
    );
  }

  return (
    <CrmShell
      screenType={screenType}
      onScreenChange={onScreenChange}
      state={state}
      dispatch={dispatch}
      highlightedElement={highlightedElement}
      isAutoRunning={isAutoRunning}
      currentStepLabel={currentStepLabel}
      completedSteps={completedSteps}
    />
  );
}
