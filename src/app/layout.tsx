import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BottomNav } from '@/components/bottom-nav'
import { BottomNavSpacer } from '@/components/bottom-nav-spacer'
import { PWAInstall } from '@/components/pwa-install'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/lib/language-context'
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: {
    default: 'EQ FreeSet — 나만의 이어폰·헤드폰 EQ를 3분 만에',
    template: '%s | EQ FreeSet',
  },
  description: '이어폰·헤드폰 특성에 맞춘 A/B 블라인드 테스트로 나에게 딱 맞는 이퀄라이저 설정을 무료로 찾아보세요. 결과는 JSON으로 즉시 다운로드 가능.',
  keywords: [
    'EQ 설정', '이퀄라이저', '이어폰 EQ', '헤드폰 EQ', 'A/B 테스트', '오디오 최적화',
    '사운드 튜닝', 'AutoEQ', 'EQ FreeSet', '무료 EQ', '개인화 EQ', '청음 테스트',
    '이어폰 추천 EQ', '헤드폰 튜닝', 'equalizer settings',
  ],
  authors: [{ name: 'EQ FreeSet' }],
  creator: 'EQ FreeSet',
  publisher: 'EQ FreeSet',
  metadataBase: new URL('https://eqfreeset.pages.dev'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'EQ FreeSet — 나만의 이어폰·헤드폰 EQ를 3분 만에',
    description: '이어폰·헤드폰에 맞는 EQ를 A/B 블라인드 테스트로 무료로 찾아보세요. 결과를 JSON으로 즉시 다운로드.',
    url: 'https://eqfreeset.pages.dev',
    siteName: 'EQ FreeSet',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EQ FreeSet — 나만의 이퀄라이저 설정을 3분 만에 찾아보세요',
        type: 'image/png',
      }
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EQ FreeSet — 나만의 이어폰·헤드폰 EQ를 3분 만에',
    description: 'A/B 블라인드 테스트로 내 귀에 꼭 맞는 이퀄라이저 설정을 무료로 찾아보세요.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
}

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <head>
        {/* 테마 초기화 스크립트 (깜빡임 방지) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // ─── v1 구버전 키 마이그레이션 ───
                var oldTheme = localStorage.getItem('theme');
                if (oldTheme !== null) {
                  if (!localStorage.getItem('v2_theme')) {
                    localStorage.setItem('v2_theme', oldTheme);
                  }
                  localStorage.removeItem('theme');
                }

                // ─── 구버전 불필요 키 완전 삭제 ───
                // (v1에서 사용하던 Zustand persist, 테스트 결과 등)
                var legacyKeys = [
                  'eq-result', 'eq-test-result', 'eq-responses',
                  'eq-device', 'eq-step', 'eq-audio-type',
                  'test-store', 'audio-store',
                  'zustand-test', 'zustand-audio',
                ];
                legacyKeys.forEach(function(k) {
                  localStorage.removeItem(k);
                  sessionStorage.removeItem(k);
                });

                // ─── 다크/라이트 테마 즉시 적용 (깜빡임 방지) ───
                var stored = localStorage.getItem('v2_theme');
                var isDark = stored ? stored === 'dark' : true;
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3853805636561789" crossOrigin="anonymous"></script>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0PPLGZP5EM"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0PPLGZP5EM');
            `,
          }}
        />
        {/* Microsoft Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "wjkoxkdhez");
            `,
          }}
        />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased transition-colors duration-300")}>
        <ThemeProvider>
          <LanguageProvider>
            <PWAInstall />
            <div className="min-h-screen">
              {children}
              <BottomNavSpacer />
            </div>
            <BottomNav />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
