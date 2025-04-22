// apps/user-app/public/audio-sw.js

const CACHE_NAME = 'audio-cache-v1';
const MAX_CACHE_ITEMS = 50; // Limit cache size

// Files to cache on install (optional, e.g., app shell, icons)
// const urlsToCache = [ '/', '/manifest.json', '/icons/icon-192x192.png' ];

self.addEventListener('install', (event) => {
    console.log('[SW] Install event');
    // event.waitUntil(
    //     caches.open(CACHE_NAME).then((cache) => {
    //         console.log('[SW] Precaching app shell');
    //         return cache.addAll(urlsToCache);
    //     })
    // );
    // Force the waiting service worker to become the active service worker.
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activate event');
    // Remove previous cached data from disk.
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Tell the active service worker to take control of the page immediately.
    event.waitUntil(self.clients.claim());
});

// Function to limit cache size
async function limitCacheSize(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
        console.log(`[SW] Cache ${cacheName} has ${keys.length} items, trimming to ${maxItems}...`);
        // Delete oldest items (assuming chronological addition correlates roughly with key order)
        for (let i = 0; i < keys.length - maxItems; i++) {
            await cache.delete(keys[i]);
            console.log(`[SW] Deleted oldest cache item: ${keys[i].url}`);
        }
    }
}

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Identify audio requests (adjust pattern as needed)
    // Example: Match backend play URLs or direct storage URLs
    const isAudioRequest = url.pathname.startsWith('/api/v1/audio/tracks/') && url.pathname.endsWith('/play');
    // Example 2: Match MinIO/S3 URLs if known
    // const isAudioRequest = url.hostname === 'your-storage.domain.com' && url.pathname.includes('/audio/');

    if (isAudioRequest) {
        // console.log('[SW] Handling fetch event for:', event.request.url);
         // Network-first, cache-fallback strategy for audio
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                try {
                    // Try the network first
                    const networkResponse = await fetch(event.request);
                    console.log('[SW] Fetched from network:', event.request.url);

                    // Check if the response is valid (e.g., 200 OK or 206 Partial Content)
                    if (networkResponse.ok || networkResponse.status === 206) {
                        // Put a copy of the response in the cache
                        // Note: Responses are streams and can only be consumed once.
                        // We need to clone it to put one copy in cache and serve the other.
                        cache.put(event.request, networkResponse.clone()).then(() => {
                            // Limit cache size after adding a new item
                            limitCacheSize(CACHE_NAME, MAX_CACHE_ITEMS);
                        });
                    } else {
                         console.warn(`[SW] Network request failed with status: ${networkResponse.status} for ${event.request.url}`);
                         // Don't cache bad responses, try cache next
                    }

                    // Return the original response from the network
                    return networkResponse;
                } catch (error) {
                    // Network request failed, try the cache
                    console.log('[SW] Network fetch failed, trying cache for:', event.request.url, error);
                    const cachedResponse = await cache.match(event.request);
                    if (cachedResponse) {
                        console.log('[SW] Serving from cache:', event.request.url);
                        return cachedResponse;
                    }
                    // Network and cache failed
                    console.error('[SW] Network and cache failed for:', event.request.url);
                    // Return a basic error response
                    return new Response('Network error and resource not found in cache.', {
                        status: 404, // Or 504 Gateway Timeout
                        statusText: 'Not Found in Cache or Network',
                    });
                }
            })
        );
    }
    // For non-audio requests, let the browser handle it normally.
    // else { event.respondWith(fetch(event.request)); } // Implicitly happens if we don't call respondWith
});