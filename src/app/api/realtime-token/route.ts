import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      "https://api.openai.com/v1/realtime/transcription_sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_audio_format: "pcm16",
          input_audio_transcription: {
            model: "gpt-4o-mini-transcribe",
            language: "ko",
          },
          turn_detection: {
            type: "server_vad",
            silence_duration_ms: 500,
          },
          input_audio_noise_reduction: {
            type: "near_field",
          },
        }),
      }
    );

    if (!res.ok) {
      const body = await res.text();
      console.error("OpenAI token 발급 실패:", res.status, body);
      return NextResponse.json(
        { error: `토큰 발급 실패 (${res.status}): ${body}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      token: data.client_secret?.value,
      expires_at: data.client_secret?.expires_at,
    });
  } catch (err) {
    console.error("Token API 오류:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
