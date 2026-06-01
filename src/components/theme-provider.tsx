'use client'

import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check localStorage (v2 key), default to dark mode
    const stored = localStorage.getItem('v2_theme')
    const isDark = stored ? stored === 'dark' : true
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return <>{children}</>
}
