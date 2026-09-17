'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/language-context'

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    { href: '/', label: t.nav.home },
    { href: '/test', label: t.nav.test },
    { href: '/info', label: t.nav.info },
  ]

  const NO_NAV = ['/test', '/result']
  const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  if (NO_NAV.includes(clean)) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 border-t border-border backdrop-blur-sm">
      <div className="flex justify-around items-center h-14 px-4 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/' || pathname === ''
            : item.href === '/info'
              ? pathname.startsWith('/info') || pathname.startsWith('/guide')
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                "flex items-center justify-center flex-1 py-2 text-xs font-medium transition-colors duration-150",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
