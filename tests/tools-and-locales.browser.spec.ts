import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const url = new URL(route.request().url())
    return url.hostname === '127.0.0.1' || ['blob:', 'data:'].includes(url.protocol) ? route.continue() : route.abort()
  })
})

test('localized URLs render their language, link within it, and declare hreflang', async ({ page }) => {
  await page.goto('/en/tools/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Earphone Left/Right, Frequency and Mic Test')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://eqfreeset.pages.dev/en/tools/')
  await expect(page.locator('link[rel="alternate"][hreflang="ko"]')).toHaveAttribute('href', 'https://eqfreeset.pages.dev/tools/')
  await expect(page.locator('link[rel="alternate"][hreflang="ja"]')).toHaveAttribute('href', 'https://eqfreeset.pages.dev/ja/tools/')
  // 같은 언어 페이지로 이어지는 내부 링크, 언어별 페이지가 없는 곳은 기본 주소
  await expect(page.locator('footer a[href^="/en/guide/"]').first()).toBeVisible()
  await expect(page.locator('footer a[href^="/privacy"]')).toHaveCount(1)

  // 정적 HTML 자체가 해당 언어여야 검색엔진이 읽을 수 있다
  const html = await (await page.request.get('/ja/eq/sony-wh-1000xm5/')).text()
  expect(html).toContain('Sony WH-1000XM5 EQ設定おすすめ')
  expect(html).toContain('"@type":"BreadcrumbList"')

  // 언어를 바꾸면 해당 언어 주소로 이동 (언어 선택은 홈 화면에 있음)
  await page.goto('/en/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your ears')
  await page.getByRole('button', { name: 'Select Language' }).click()
  await page.getByRole('button', { name: '日本語', exact: true }).click()
  await expect(page).toHaveURL(/\/ja\/?$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja')
  await page.getByRole('button', { name: 'Select Language' }).click()
  await page.getByRole('button', { name: '한국어', exact: true }).click()
  await expect(page).toHaveURL(/127\.0\.0\.1:4173\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('내 귀니까')
})

test('Korean pages keep Korean HTML and point to the language versions', async ({ page }) => {
  const html = await (await page.request.get('/guide/eq-apps/')).text()
  expect(html).toContain('<html lang="ko"')
  expect(html).toContain('hrefLang="en" href="https://eqfreeset.pages.dev/en/guide/eq-apps/"')
  expect(html).toContain('"@type":"Article"')
  const sitemap = await (await page.request.get('/sitemap.xml')).text()
  expect(sitemap).toContain('<loc>https://eqfreeset.pages.dev/zh/eq/</loc>')
  expect(sitemap).toContain('hreflang="x-default"')
  expect(sitemap).not.toContain('/en/privacy/')
})
