"use client";

import { useState, useRef, useCallback } from "react";

interface UseAiSuggestionOptions {
  autoSpeak?: boolean;
}

export function useAiSuggestion(options: UseAiSuggestionOptions = {}) {
  const { autoSpeak = true } = options;

  const [suggestion, setSuggestion] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(autoSpeak);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      const src = audioRef.current.src;
      audioRef.current = null;
      URL.revokeObjectURL(src);
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text: string, onSpeakEnd?: () => void) => {
    try {
      stopSpeaking();
      setIsSpeaking(true);

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("TTS 요청 실패");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
        audioRef.current = null;
        onSpeakEnd?.();
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };

      audioRef.current = audio;
      await audio.play();
    } catch {
      setIsSpeaking(false);
    }
  }, [stopSpeaking]);

  const generate = useCallback(
    async (
      params: {
        query: string;
        contexts: string[];
        keywords?: string[];
        screenType?: string;
      },
      onSpeakEnd?: () => void
    ) => {
      // Cancel previous
      if (abortRef.current) abortRef.current.abort();
      stopSpeaking();

      const controller = new AbortController();
      abortRef.current = controller;

      setSuggestion("");
      setIsGenerating(true);
      setError(null);

      try {
        const res = await fetch("/api/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("응답 생성 실패");

        const reader = res.body?.getReader();
        if (!reader) throw new Error("스트림 없음");

        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullText += parsed.text;
                  setSuggestion(fullText);
                }
              } catch {
                // ignore parse errors
              }
            }
          }
        }

        setIsGenerating(false);

        // Auto-speak after generation complete
        if (autoSpeakEnabled && fullText.length > 0 && !controller.signal.aborted) {
          speak(fullText, onSpeakEnd);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (!controller.signal.aborted) {
          setError("AI 응답 생성 중 오류가 발생했습니다.");
          setIsGenerating(false);
        }
      }
    },
    [autoSpeakEnabled, speak, stopSpeaking]
  );

  const reset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    stopSpeaking();
    setSuggestion("");
    setIsGenerating(false);
    setError(null);
  }, [stopSpeaking]);

  return {
    suggestion,
    isGenerating,
    isSpeaking,
    error,
    autoSpeakEnabled,
    setAutoSpeakEnabled,
    generate,
    speak,
    stopSpeaking,
    reset,
  };
}
