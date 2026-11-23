'use client'

import Link from 'next/link'
import { AudioLines, ArrowUpRight, Check, Clock3, Headphones, LockKeyhole, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { EQPreview } from '@/components/eq-preview'
import { useLanguage } from '@/lib/language-context'
import { experienceCopy } from '@/lib/experience-copy'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { AdBanner } from '@/components/ad-banner'
import { ADSENSE_CONFIG } from '@/lib/ad-config'
import { GUIDES } from '@/lib/guides'

export default function HomeContent() {
  const { t, lang } = useLanguage()
  const h = t.home
  const c = experienceCopy[lang]
  const steps = [
    { icon: Headphones, title: h.step1Title, desc: h.step1Desc },
    { icon: AudioLines, title: h.step2Title, desc: h.step2Desc },
    { icon: SlidersHorizontal, title: h.step3Title, desc: h.step3Desc },
  ]

  return (
    <main className="page-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <Link href="/" className="brand"><AudioLines aria-hidden="true" className="h-6 w-6 text-primary" /><span>EQ FreeSet</span></Link>
          <nav className="hidden md:flex gap-7 text-sm text-muted-foreground" aria-label={t.nav.info}>
            <a href="#how-it-works" className="hover:text-foreground">{c.how}</a>
            <Link href="/guide" className="hover:text-foreground">{h.guidesTitle}</Link>
            <Link href="/result" className="hover:text-foreground">{t.result.pageTitle}</Link>
          </nav>
          <div className="flex items-center gap-1"><LanguageToggle /><ThemeToggle /></div>
        </div>
      </header>

      <div className="home-container">
        <section className="home-hero">
          <div className="hero-copy">
            <div className="inline-flex items-center gap-2 text-sm text-primary mb-6"><Headphones className="h-4 w-4" aria-hidden="true" />{h.heroBadge}</div>
            <h1 className="hero-title">{c.title}</h1>
            <p className="hero-description">{c.desc}</p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Button asChild className="btn-primary h-12 px-7 text-base"><Link href="/test">{c.start}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></Button>
              <Button asChild variant="ghost" className="h-12 px-4"><a href="#how-it-works">{c.how}</a></Button>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{c.time}</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" aria-hidden="true" />{c.free}</span>
            </div>
          </div>
          <EQPreview />
        </section>

        <section id="how-it-works" className="home-section scroll-mt-24">
          <div className="section-intro"><h2>{c.steps}</h2><p>{c.stepDesc}</p></div>
          <ol className="home-steps">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <li key={title}><div className="flex items-center justify-between mb-6"><Icon className="h-6 w-6 text-primary" aria-hidden="true" /><span className="step-number">{i + 1}</span></div><h3 className="font-semibold mb-2">{title}</h3><p className="text-sm leading-relaxed text-muted-foreground">{desc}</p></li>
            ))}
          </ol>
        </section>

        <section className="preparation-panel">
          <div><div className="flex items-center gap-2 mb-3"><LockKeyhole className="h-4 w-4 text-primary" aria-hidden="true" /><span className="text-sm font-medium">{c.local}</span></div><h2 className="text-xl font-semibold tracking-tight">{c.ready}</h2><p className="text-xs text-muted-foreground leading-relaxed mt-4 max-w-md">{c.limit}</p></div>
          <ul className="space-y-4">{c.checks.map(check => <li key={check} className="flex items-start gap-3 text-sm"><Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />{check}</li>)}</ul>
        </section>

        <section className="home-section">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7"><h2 className="section-title">{c.guides}</h2><Link href="/guide" className="text-sm text-primary whitespace-nowrap py-2">{h.allGuides}</Link></div>
          <div className="home-guides">{GUIDES.slice(0, 4).map(guide => <Link key={guide.slug} href={`/guide/${guide.slug}`} className="guide-link"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-sm">{guide.title[lang]}</h3><ArrowUpRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" /></div><p className="mt-2 text-sm text-muted-foreground leading-relaxed">{guide.desc[lang]}</p></Link>)}</div>
        </section>

        <section className="home-section home-faq">
          <div><Sparkles className="h-5 w-5 text-primary mb-4" aria-hidden="true" /><h2 className="section-title">{c.faq}</h2><Link href="/contact" className="inline-block mt-4 text-sm text-muted-foreground hover:text-foreground">{h.ctaContact}</Link></div>
          <Accordion type="single" collapsible>{[[h.faq1Q, h.faq1A], [h.faq2Q, h.faq2A], [h.faq3Q, h.faq3A]].map(([q, a], i) => <AccordionItem key={q} value={`faq-${i}`}><AccordionTrigger className="text-left text-sm leading-relaxed py-5 hover:no-underline">{q}</AccordionTrigger><AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">{a}</AccordionContent></AccordionItem>)}</Accordion>
        </section>
        <AdBanner slot={ADSENSE_CONFIG.SLOTS.HOME_BOTTOM} className="my-6" />
      </div>
    </main>
  )
}
