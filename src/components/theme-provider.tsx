'use client'

import { useEffect, useState } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check localStorage (v2 key), default to dark mode
    const stored = localStorage.getItem('v2_theme')
    const isDark = stored ? stored === 'dark' : true
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  if (!mounted) return <>{children}</>

  return <>{children}</>
}
