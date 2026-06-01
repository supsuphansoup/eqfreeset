'use client'

import { useEffect } from 'react'

export function PWAInstall() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const register = () => navigator.serviceWorker.register('/sw.js').catch(() => {})
    // load 이벤트가 이미 발생했으면 즉시 등록, 아직이면 이벤트 대기
    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register, { once: true })
    }
  }, [])

  return null
}