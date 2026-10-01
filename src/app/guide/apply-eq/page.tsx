import type { Metadata } from 'next'
import { GuideArticleView } from '@/components/guide-article'
import content from '@/lib/guides/content/apply-eq'

export const metadata: Metadata = {
  title: 'How to Apply EQ on Your Device',
  description: 'Step-by-step guide to entering EQ values on Galaxy, Android, iPhone, Windows (Equalizer APO) and Mac, plus preamp settings to prevent clipping.',
  alternates: { canonical: '/guide/apply-eq/' },
}

export default function ApplyEqPage() {
  return <GuideArticleView slug="apply-eq" content={content} />
}
