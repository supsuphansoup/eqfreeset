'use client'

import { useEffect } from 'react'

export function PWAInstall() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // SW 등록 실패 시 조용히 무시
        })
      })
    }
  }, [])

  return null
}