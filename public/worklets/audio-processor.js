/**
 * AudioWorklet processor that resamples browser audio (typically 48kHz)
 * to 24kHz PCM16 mono and sends chunks to the main thread.
 */
class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;

    // Take first channel (mono)
    const channelData = input[0];
    if (!channelData || channelData.length === 0) return true;

    // Resample from sampleRate to 24000 Hz
    const inputRate = sampleRate; // global in AudioWorklet scope
    const outputRate = 24000;
    const ratio = inputRate / outputRate;

    for (let i = 0; i < channelData.length; i++) {
      this._buffer.push(channelData[i]);
    }

    // Process buffered samples in chunks
    const outputSamples = Math.floor(this._buffer.length / ratio);
    if (outputSamples === 0) return true;

    const pcm16 = new Int16Array(outputSamples);
    for (let i = 0; i < outputSamples; i++) {
      const srcIndex = i * ratio;
      const srcIndexFloor = Math.floor(srcIndex);
      const srcIndexCeil = Math.min(srcIndexFloor + 1, this._buffer.length - 1);
      const frac = srcIndex - srcIndexFloor;

      // Linear interpolation
      const sample =
        this._buffer[srcIndexFloor] * (1 - frac) +
        this._buffer[srcIndexCeil] * frac;

      // Clamp and convert to PCM16
      const clamped = Math.max(-1, Math.min(1, sample));
      pcm16[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    }

    // Remove consumed samples from buffer
    const consumed = Math.floor(outputSamples * ratio);
    this._buffer = this._buffer.slice(consumed);

    // Send PCM16 buffer to main thread
    this.port.postMessage(pcm16.buffer, [pcm16.buffer]);

    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
