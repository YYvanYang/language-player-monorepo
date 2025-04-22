// packages/utils/src/hooks/useAudioClip.ts
'use client'; // This hook is for client-side components

import { useEffect, useCallback, useRef } from 'react';

// Use a module-level cache to avoid re-creating Audio elements unnecessarily
const audioCache: Record<string, HTMLAudioElement> = {};

interface AudioCacheEntry {
    audio: HTMLAudioElement | null;
    error: boolean;
}

const audioCacheRef: Record<string, AudioCacheEntry> = {};

/**
 * A hook to preload and play short audio clips for UI interactions.
 * Ensures clips are loaded efficiently and played immediately on demand.
 *
 * @param path - The public path to the audio file (e.g., '/sounds/click.wav').
 * @param volume - The playback volume (0 to 1), defaults to 0.2.
 * @returns A function to call to play the sound clip.
 */
export function useAudioClip(path: string, volume: number = 0.2): () => void {
    const pathRef = useRef(path); // Store path in ref to avoid re-running effect if path changes unnecessarily

    useEffect(() => {
        const currentPath = pathRef.current;
        if (!currentPath || typeof window === 'undefined') {
            return; // Exit if path is empty or not in browser
        }

        // Initialize cache entry if it doesn't exist
        if (!audioCacheRef[currentPath]) {
             audioCacheRef[currentPath] = { audio: null, error: false };
             console.log(`[useAudioClip] Initializing cache for: ${currentPath}`);
        }

        const cacheEntry = audioCacheRef[currentPath];

        // Only proceed if audio hasn't been loaded or failed previously
        if (!cacheEntry.audio && !cacheEntry.error) {
            const audio = new Audio(currentPath);
            audio.preload = 'auto'; // Start loading immediately
            audio.volume = Math.max(0, Math.min(1, volume)); // Set initial volume

            const handleLoadError = () => {
                 console.error(`[useAudioClip] Failed to load audio clip: ${currentPath}`);
                 cacheEntry.error = true; // Mark as failed
                 cacheEntry.audio = null; // Ensure audio element is nullified
            };

            const handleCanPlay = () => {
                console.log(`[useAudioClip] Audio ready: ${currentPath}`);
                // Successfully loaded, store the instance
                cacheEntry.audio = audio;
                // Clean up listeners for this specific load attempt
                 audio.removeEventListener('error', handleLoadError);
                 audio.removeEventListener('canplaythrough', handleCanPlay); // Use canplaythrough for better readiness
            };

            audio.addEventListener('error', handleLoadError, { once: true });
            audio.addEventListener('canplaythrough', handleCanPlay, { once: true });

             // Attempt to load
             audio.load();
        }

         // No cleanup needed here as we want the audio element to persist in the cache
         // The event listeners are removed once the load succeeds or fails.

    }, []); // Run only once on mount for the initial path

    // Memoize the play function
    const play = useCallback(() => {
        const cacheEntry = audioCacheRef[pathRef.current];
        if (cacheEntry?.audio && !cacheEntry.error) {
            cacheEntry.audio.volume = Math.max(0, Math.min(1, volume)); // Update volume just before playing
            cacheEntry.audio.currentTime = 0; // Rewind to start
            cacheEntry.audio.play().catch(err => {
                 // Playback can fail if interrupted or due to browser restrictions
                 console.warn(`[useAudioClip] Could not play ${pathRef.current}:`, err);
            });
        } else if (cacheEntry?.error) {
            // console.warn(`[useAudioClip] Cannot play ${pathRef.current}: Load failed previously.`);
        } else {
             // console.warn(`[useAudioClip] Cannot play ${pathRef.current}: Audio not loaded yet.`);
             // Optionally, try to load again here if needed, but might indicate an issue
        }
    }, [volume]); // Dependency on volume ensures the play function uses the latest volume

    return play;
}