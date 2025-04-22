// apps/user-app/_lib/constants.ts

// Threshold (in milliseconds) to decide between WAAPI direct buffer vs. streaming
// A lower threshold means more files might use WAAPI (potentially faster start after load, but uses more memory).
// A higher threshold means more files use streaming (lower memory, potentially slower start).
export const AUDIO_DURATION_THRESHOLD_MS = 5 * 60 * 1000; // Example: 5 minutes = 300,000 ms

export enum PlaybackState {
  IDLE = 'IDLE',         // No track loaded or player stopped/reset
  LOADING = 'LOADING',   // Fetching track metadata or audio data (initial load)
  DECODING = 'DECODING', // WAAPI only: Browser is decoding the ArrayBuffer (Maybe less relevant now?)
  BUFFERING = 'BUFFERING', // Streaming only: Waiting for enough data to play/resume
  READY = 'READY',       // Audio data is loaded/decoded, ready to play (but currently paused/stopped)
  PLAYING = 'PLAYING',   // Audio is actively playing
  PAUSED = 'PAUSED',     // Playback explicitly paused by user or interruption
  SEEKING = 'SEEKING',   // ADDED: Player is currently seeking to a new position
  ENDED = 'ENDED',       // Playback reached the natural end of the track
  ERROR = 'ERROR',       // An error occurred during loading or playback
}