'use client'

import { usePathname } from 'next/navigation'

const NO_NAV_PATHS = ['/test', '/result']

export function BottomNavSpacer() {
  const pathname = usePathname()
  const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  if (NO_NAV_PATHS.includes(clean)) return null
  return <div className="h-16" aria-hidden="true" />
}
