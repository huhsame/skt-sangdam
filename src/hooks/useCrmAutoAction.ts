"use client";

import { useState, useRef, useCallback } from "react";
import type { CrmAction, CrmScreenType } from "@/types/crm";
import { getActionSequence } from "@/lib/crm-action-sequences";

interface UseCrmAutoActionParams {
  dispatch: (action: CrmAction) => void;
  setHighlightedElement: (id: string | null) => void;
}

export function useCrmAutoAction({
  dispatch,
  setHighlightedElement,
}: UseCrmAutoActionParams) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [currentStepLabel, setCurrentStepLabel] = useState("");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cleanup = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setHighlightedElement(null);
  }, [setHighlightedElement]);

  const run = useCallback(
    (screenType: CrmScreenType, keywords?: string[]) => {
      const sequence = getActionSequence(screenType, keywords);
      if (!sequence) return;

      cleanup();
      setIsRunning(true);
      setCurrentStepIndex(0);
      setCompletedSteps([]);

      const { steps, dispatches } = sequence;
      let cumulativeDelay = 0;

      steps.forEach((step, i) => {
        cumulativeDelay += step.delayBefore;

        // Highlight + set current label
        const highlightTimer = setTimeout(() => {
          setCurrentStepIndex(i);
          setCurrentStepLabel(step.label);
          setHighlightedElement(step.elementId);
        }, cumulativeDelay);
        timersRef.current.push(highlightTimer);

        // Dispatch action after highlight visible
        const dispatchDelay = cumulativeDelay + 600; // after cursor animation
        const dispatchTimer = setTimeout(() => {
          if (dispatches[i]) {
            dispatch(dispatches[i]);
          }
          setCompletedSteps((prev) => [...prev, step.label]);
        }, dispatchDelay);
        timersRef.current.push(dispatchTimer);

        cumulativeDelay = dispatchDelay + step.delayAfter;
      });

      // Finish
      const finishTimer = setTimeout(() => {
        setIsRunning(false);
        setCurrentStepIndex(-1);
        setCurrentStepLabel("");
        setHighlightedElement(null);
      }, cumulativeDelay + 500);
      timersRef.current.push(finishTimer);
    },
    [dispatch, setHighlightedElement, cleanup]
  );

  const stop = useCallback(() => {
    cleanup();
    setIsRunning(false);
    setCurrentStepIndex(-1);
    setCurrentStepLabel("");
    setCompletedSteps([]);
  }, [cleanup]);

  return {
    isRunning,
    currentStepIndex,
    currentStepLabel,
    completedSteps,
    run,
    stop,
  };
}
