export type TranscriptionStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "speaking"
  | "error";

export interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: number;
}

// --- OpenAI Realtime Transcription API event types ---

export interface RTSessionCreated {
  type: "transcription_session.created";
  session: { id: string };
}

export interface RTSessionUpdated {
  type: "transcription_session.updated";
  session: { id: string };
}

export interface RTInputAudioBufferSpeechStarted {
  type: "input_audio_buffer.speech_started";
}

export interface RTInputAudioBufferSpeechStopped {
  type: "input_audio_buffer.speech_stopped";
}

export interface RTTranscriptionDelta {
  type: "conversation.item.input_audio_transcription.delta";
  delta: string;
  item_id: string;
}

export interface RTTranscriptionCompleted {
  type: "conversation.item.input_audio_transcription.completed";
  transcript: string;
  item_id: string;
}

export interface RTError {
  type: "error";
  error: { message: string; type: string; code?: string };
}

export type RTServerEvent =
  | RTSessionCreated
  | RTSessionUpdated
  | RTInputAudioBufferSpeechStarted
  | RTInputAudioBufferSpeechStopped
  | RTTranscriptionDelta
  | RTTranscriptionCompleted
  | RTError;
