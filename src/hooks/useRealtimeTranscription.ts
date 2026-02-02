"use client";

import { useState, useRef, useCallback } from "react";
import type {
  TranscriptionStatus,
  TranscriptEntry,
  RTServerEvent,
} from "@/types/transcription";

export function useRealtimeTranscription(
  onUtteranceComplete: (text: string) => void
) {
  const [status, setStatus] = useState<TranscriptionStatus>("idle");
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [currentDelta, setCurrentDelta] = useState("");
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);

  const cleanup = useCallback(() => {
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    try {
      setError(null);
      setStatus("connecting");
      setCurrentDelta("");

      // 1. Get ephemeral token
      const tokenRes = await fetch("/api/realtime-token", { method: "POST" });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) {
        throw new Error(tokenData.error || "토큰 발급에 실패했습니다.");
      }
      const { token } = tokenData;
      if (!token) {
        throw new Error("토큰이 비어있습니다.");
      }

      // 2. Get microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: { ideal: 48000 },
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      // 3. Set up AudioContext + Worklet
      const audioContext = new AudioContext({ sampleRate: 48000 });
      audioContextRef.current = audioContext;

      await audioContext.audioWorklet.addModule("/worklets/audio-processor.js");
      const source = audioContext.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(audioContext, "audio-processor");
      workletNodeRef.current = workletNode;
      source.connect(workletNode);
      // Don't connect to destination (we don't want to play back)

      // 4. Connect WebSocket
      const wsUrl = `wss://api.openai.com/v1/realtime?intent=transcription`;
      const ws = new WebSocket(wsUrl, [
        "realtime",
        `openai-insecure-api-key.${token}`,
        "openai-beta.realtime-v1",
      ]);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("listening");

        // Forward audio from worklet to WebSocket
        workletNode.port.onmessage = (event: MessageEvent<ArrayBuffer>) => {
          if (ws.readyState !== WebSocket.OPEN) return;

          const pcm16 = new Int16Array(event.data);
          // Convert to base64
          const bytes = new Uint8Array(pcm16.buffer);
          let binary = "";
          for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);

          ws.send(
            JSON.stringify({
              type: "input_audio_buffer.append",
              audio: base64,
            })
          );
        };
      };

      ws.onmessage = (event) => {
        let msg: RTServerEvent;
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }

        switch (msg.type) {
          case "input_audio_buffer.speech_started":
            setStatus("speaking");
            break;

          case "input_audio_buffer.speech_stopped":
            setStatus("listening");
            break;

          case "conversation.item.input_audio_transcription.delta":
            setCurrentDelta((prev) => prev + msg.delta);
            break;

          case "conversation.item.input_audio_transcription.completed": {
            const text = msg.transcript.trim();
            if (text) {
              const entry: TranscriptEntry = {
                id: msg.item_id,
                text,
                timestamp: Date.now(),
              };
              setTranscripts((prev) => [...prev, entry]);
              onUtteranceComplete(text);
            }
            setCurrentDelta("");
            break;
          }

          case "error":
            console.error("Realtime API error:", msg.error);
            setError(msg.error.message);
            break;
        }
      };

      ws.onerror = () => {
        setError("WebSocket 연결 오류가 발생했습니다.");
        setStatus("error");
        cleanup();
      };

      ws.onclose = () => {
        if (status !== "idle") {
          setStatus("idle");
        }
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(message);
      setStatus("error");
      cleanup();
    }
  }, [cleanup, onUtteranceComplete, status]);

  const stop = useCallback(() => {
    cleanup();
    setStatus("idle");
    setCurrentDelta("");
  }, [cleanup]);

  return {
    status,
    transcripts,
    currentDelta,
    error,
    start,
    stop,
  };
}
