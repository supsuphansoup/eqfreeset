'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/lib/language-context'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Home() {
  const { t } = useLanguage()
  const h = t.home

  return (
    <main className="page-shell">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-inner">
          <Link href="/" className="flex items-center gap-2.5 select-none">
            <span className="text-sm font-bold tracking-tight text-foreground">EQ FreeSet</span>
          </Link>
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-lg">
        {/* Hero */}
        <section className="py-16 fade-up text-center">
          <p className="label-xs mb-4 justify-center flex">{h.heroBadge}</p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground mb-4">
            {h.heroTitle1}<span className="text-primary">{h.heroTitle2}</span>{h.heroTitle3}
            <br />{h.heroTitle4}
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">
            {h.heroDesc}
          </p>
          <div className="flex justify-center">
            <Link href="/test">
              <Button className="btn-primary h-11 px-6 text-sm rounded-lg">
                {t.common.startTest}
              </Button>
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Steps */}
        <section className="py-12 fade-up text-center">
          <p className="label-xs mb-6 flex justify-center">
            {h.stepsTitle1}{h.stepsTitle2}{h.stepsTitle3}
          </p>
          <div className="space-y-6">
            {[
              { title: h.step1Title, desc: h.step1Desc },
              { title: h.step2Title, desc: h.step2Desc },
              { title: h.step3Title, desc: h.step3Desc },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-0.5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Info article */}
        <section className="py-12 fade-up">
          <p className="label-xs mb-4">{h.infoTitle}</p>
          <h2 className="text-base font-semibold text-foreground mb-2">{h.infoArticleTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{h.infoArticleDesc}</p>
          <Link href="/info" className="text-sm text-primary font-medium hover:underline underline-offset-4 transition-colors">
            {t.common.learnMore}
          </Link>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* FAQ */}
        <section className="py-12 fade-up">
          <p className="label-xs mb-6">{h.faqTitle}</p>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b border-border">
              <AccordionTrigger className="text-sm font-medium text-left hover:no-underline hover:text-primary transition-colors py-4">
                {h.faq1Q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {h.faq1A}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-b border-border">
              <AccordionTrigger className="text-sm font-medium text-left hover:no-underline hover:text-primary transition-colors py-4">
                {h.faq2Q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {h.faq2A}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-b border-border">
              <AccordionTrigger className="text-sm font-medium text-left hover:no-underline hover:text-primary transition-colors py-4">
                {h.faq3Q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {h.faq3A}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* CTA Links */}
        <section className="py-10 flex flex-col gap-2 fade-up">
          <Link href="/info" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5">
            {h.ctaReadInfo} →
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5">
            {h.ctaContact} →
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">{h.footerTerms}</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">{h.footerPrivacy}</Link>
            <Link href="/license" className="hover:text-foreground transition-colors">{h.footerLicense}</Link>
          </div>
          <p className="text-muted-foreground/60">{h.footerSuno}</p>
          <p className="text-muted-foreground/60 mt-0.5">{h.footerCopyright}</p>
        </footer>
      </div>
    </main>
  )
}
