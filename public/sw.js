// Service Worker for EQ FreeSet PWA
const CACHE_VERSION = 'v1.0.2'
const STATIC_CACHE = `eqfreeset-static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `eqfreeset-dynamic-${CACHE_VERSION}`
const ALL_CACHES = [STATIC_CACHE, DYNAMIC_CACHE]

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
]

// Install event — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch(() => {})
  )
  self.skipWaiting()
})

// Activate event — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => !ALL_CACHES.includes(name))
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  )
})

// Fetch event — serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') return

  // API requests: network-only with offline fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => new Response(
        JSON.stringify({ error: 'Offline', message: '인터넷 연결이 필요합니다.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      ))
    )
    return
  }

  // Audio sample requests — cache on first fetch
  if (url.pathname.startsWith('/samples/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          if (!response || response.status !== 200) return response
          const toCache = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, toCache))
          return response
        }).catch(() => new Response('Audio sample not available offline', {
          status: 503, headers: { 'Content-Type': 'text/plain' }
        }))
      })
    )
    return
  }

  // Default: Cache First for static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response
        const toCache = response.clone()
        caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, toCache))
        return response
      }).catch(() => {
        if (request.mode === 'navigate') {
          return caches.match('/').then((r) => r || new Response('Offline', {
            status: 503, headers: { 'Content-Type': 'text/plain' }
          }))
        }
        return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
      })
    })
  )
})