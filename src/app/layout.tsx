import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { BottomNav } from '@/components/bottom-nav'
import { BottomNavSpacer } from '@/components/bottom-nav-spacer'
import { PWAInstall } from '@/components/pwa-install'
import { SiteFooter } from '@/components/site-footer'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/lib/language-context'
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'EQ FreeSet — 듣고 고르는 내 이어폰·헤드폰 맞춤 EQ',
    template: '%s | EQ FreeSet',
  },
  description: '이어폰과 헤드폰에 맞는 이퀄라이저 설정을 무료로 찾아보세요. A/B 블라인드 테스트로 내 귀에 맞는 EQ 값을 받고 JSON으로 바로 내려받을 수 있습니다.',
  keywords: [
    'EQ settings', 'equalizer', 'earphone EQ', 'headphone EQ', 'A/B test', 'audio optimization',
    'sound tuning', 'AutoEQ', 'EQ FreeSet', 'free EQ', 'personalized EQ', 'hearing test',
    'EQ 설정', '이퀄라이저', '이어폰 EQ', '헤드폰 EQ', 'equalizer settings',
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
    title: 'EQ FreeSet — 듣고 고르는 내 맞춤 EQ',
    description: 'A/B 블라인드 테스트로 이어폰·헤드폰에 맞는 이퀄라이저 설정을 무료로 찾아보세요. 결과는 JSON으로 바로 내려받을 수 있습니다.',
    url: 'https://eqfreeset.pages.dev',
    siteName: 'EQ FreeSet',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EQ FreeSet — 내 취향에 맞는 이퀄라이저 설정 찾기',
        type: 'image/png',
      }
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EQ FreeSet — 듣고 고르는 내 맞춤 EQ',
    description: '이어폰·헤드폰 맞춤 이퀄라이저 설정을 A/B 블라인드 테스트로 무료로 찾아보세요.',
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
  verification: {
    google: 'MfYtcpFq9wJKFj4ZS7fVd9BUDLQXRXIRnU5xV7nF3vE',
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
        <meta name="google-site-verification" content="MfYtcpFq9wJKFj4ZS7fVd9BUDLQXRXIRnU5xV7nF3vE" />
        <meta name="google-adsense-account" content="ca-pub-3853805636561789" />
        {/* 테마 및 언어 초기화 스크립트 (깜빡임 방지) */}
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

                // ─── 언어 즉시 적용 ───
                // /en/, /zh/, /ja/ 주소는 URL 언어가 우선
                var pathLang = (location.pathname.match(new RegExp('^/(en|zh|ja)(/|$)')) || [])[1];
                var storedLang = pathLang || localStorage.getItem('v2_eq-lang');
                if (storedLang && ['ko', 'en', 'zh', 'ja'].indexOf(storedLang) !== -1) {
                  document.documentElement.lang = storedLang;
                } else {
                  document.documentElement.lang = 'ko';
                }

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
        <Script
          id="google-adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3853805636561789"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0PPLGZP5EM"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0PPLGZP5EM');
          `}
        </Script>
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
              <SiteFooter />
              <BottomNavSpacer />
            </div>
            <BottomNav />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
