// Service Worker for EQ FreeSet PWA
const CACHE_VERSION = 'v2.0.2'
const STATIC_CACHE  = `eqfreeset-static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `eqfreeset-dynamic-${CACHE_VERSION}`
const ALL_CACHES    = [STATIC_CACHE, DYNAMIC_CACHE]

// Shell assets to pre-cache on install
const STATIC_ASSETS = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
]

// ─── Install: pre-cache shell, activate immediately ───────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch(() => {})
      .then(() => self.skipWaiting())   // 대기 없이 즉시 활성화
  )
})

// ─── Activate: delete ALL old caches, take control of all tabs ────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => !ALL_CACHES.includes(name))
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())  // 열려있는 모든 탭을 즉시 제어
  )
})

// ─── Fetch: strategy by resource type ─────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // non-GET, chrome-extension → pass through
  if (request.method !== 'GET') return
  if (url.protocol === 'chrome-extension:') return

  // ── Audio samples: Cache First (용량 큰 파일, 변경 드묾) ──────────────────
  if (url.pathname.startsWith('/samples/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          if (!response || response.status !== 200) return response
          const clone = response.clone()
          caches.open(DYNAMIC_CACHE).then((c) => c.put(request, clone))
          return response
        }).catch(() =>
          new Response('Audio sample not available offline', {
            status: 503, headers: { 'Content-Type': 'text/plain' },
          })
        )
      })
    )
    return
  }

  // ── API: Network Only with offline fallback ───────────────────────────────
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(
          JSON.stringify({ error: 'Offline', message: 'Internet connection required.' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      )
    )
    return
  }

  // ── Pages / JS / CSS / JSON: Network First → Cache fallback ──────────────
  // 항상 최신 파일을 서버에서 먼저 시도 → 실패 시에만 캐시 사용
  // 이 전략으로 구버전 사용자도 온라인 상태에서는 자동으로 최신화됨
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response
        const clone = response.clone()
        caches.open(DYNAMIC_CACHE).then((c) => c.put(request, clone))
        return response
      })
      .catch(() =>
        caches.match(request).then((cached) => {
          if (cached) return cached
          if (request.mode === 'navigate') {
            return caches.match('/').then((r) =>
              r || new Response('Offline — please check your connection.', {
                status: 503, headers: { 'Content-Type': 'text/plain' },
              })
            )
          }
          return new Response('Offline', {
            status: 503, headers: { 'Content-Type': 'text/plain' },
          })
        })
      )
  )
})