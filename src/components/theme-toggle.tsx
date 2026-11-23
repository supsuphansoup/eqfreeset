'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Read the pre-hydration theme script's DOM state after mounting.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('v2_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('v2_theme', 'light')
    }
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="w-11 h-11 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
    >
      {/* key로 아이콘을 다시 마운트해 전환할 때마다 회전하며 나타남 */}
      {isDark ? <Sun key="sun" className="w-4 h-4 icon-swap" /> : <Moon key="moon" className="w-4 h-4 icon-swap" />}
    </button>
  )
}
