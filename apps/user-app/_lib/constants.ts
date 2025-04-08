// apps/user-app/_lib/constants.ts

// Threshold (in milliseconds) to decide between WAAPI direct buffer vs. streaming
// Adjust based on testing and desired behavior (e.g., 3 minutes)
export const AUDIO_DURATION_THRESHOLD_MS = 3 * 60 * 1000; // 180,000 ms

export enum PlaybackState {
  IDLE = 'IDLE',         // Nothing loaded
  LOADING = 'LOADING',   // Fetching metadata or audio data
  DECODING = 'DECODING', // WAAPI only: decoding array buffer
  BUFFERING = 'BUFFERING', // Streaming only: waiting for enough data
  READY = 'READY',       // Loaded, ready to play (or paused)
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',     // Explicitly paused by user
  ENDED = 'ENDED',       // Playback reached the end
  ERROR = 'ERROR',       // An error occurred
}