'use client'

import { useEffect, useRef } from 'react'
import { ADSENSE_CONFIG } from '@/lib/ad-config'

interface AdBannerProps {
  slot?: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal'
  responsive?: boolean
  className?: string
}

export function AdBanner({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null)
  const isPushed = useRef(false)

  const isDev = process.env.NODE_ENV === 'development'
  const adSlot = slot || ''

  useEffect(() => {
    // 슬롯이 없거나 이미 push된 경우 실행하지 않음
    if (!adSlot || isPushed.current) return

    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
          (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || [])
        adsbygoogle.push({})
        isPushed.current = true
      }
    } catch (err) {
      console.warn('Google AdSense push error:', err)
    }
  }, [adSlot])

  // 슬롯이 미지정된 경우
  if (!adSlot) {
    if (isDev) {
      return (
        <div
          className={`my-4 p-4 border border-dashed border-border/80 rounded-lg text-center text-xs text-muted-foreground bg-muted/10 ${className}`}
        >
          <p className="font-mono font-semibold text-foreground/80 mb-1">📢 Google AdSense 영역</p>
          <p>애드센스 슬롯 ID가 등록되면 실제 디스플레이 광고가 표시됩니다.</p>
        </div>
      )
    }
    // 운영 환경에서는 슬롯 ID가 없으면 빈 공간을 남기지 않고 숨김
    return null
  }

  return (
    <div className={`overflow-hidden my-4 text-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CONFIG.CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}
