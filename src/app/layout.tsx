import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { BottomNav } from '@/components/bottom-nav'
import { BottomNavSpacer } from '@/components/bottom-nav-spacer'
import { PWAInstall } from '@/components/pwa-install'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/lib/language-context'
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'EQ FreeSet — Find Your Perfect Earphone & Headphone EQ in 3 Minutes',
    template: '%s | EQ FreeSet',
  },
  description: 'Free personalized equalizer settings for your earphones and headphones. Find your perfect EQ through A/B blind testing in just 3 minutes. Download results as JSON instantly.',
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
    title: 'EQ FreeSet — Find Your Perfect EQ in 3 Minutes',
    description: 'Free personalized equalizer settings for your earphones and headphones via A/B blind testing. Download results as JSON instantly.',
    url: 'https://eqfreeset.pages.dev',
    siteName: 'EQ FreeSet',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EQ FreeSet — Find your perfect equalizer settings in 3 minutes',
        type: 'image/png',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EQ FreeSet — Find Your Perfect EQ in 3 Minutes',
    description: 'Free personalized equalizer settings for earphones and headphones. A/B blind test in 3 minutes.',
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
                var storedLang = localStorage.getItem('v2_eq-lang');
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
              <BottomNavSpacer />
            </div>
            <BottomNav />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
