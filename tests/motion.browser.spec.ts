import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const url = new URL(route.request().url())
    return url.hostname === '127.0.0.1' || ['blob:', 'data:'].includes(url.protocol) ? route.continue() : route.abort()
  })
})

const finalPoints = async (page: import('@playwright/test').Page) => {
  const curve = page.locator('.eq-preview polyline')
  let last = ''
  await expect.poll(async () => { const now = await curve.getAttribute('points'); const settled = now === last; last = now ?? ''; return settled }, { intervals: [150] }).toBe(true)
  return last
}

test('EQ preview morphs between presets and the indicator follows the selected preset', async ({ page }) => {
  await page.goto('/')
  const curve = page.locator('.eq-preview polyline')
  const start = await finalPoints(page)
  const presets = page.locator('.preview-presets button')
  await presets.nth(1).click()
  // 중간 프레임이 존재: 시작값도 최종값도 아닌 좌표가 한 번 이상 나타남
  const frames = await curve.evaluate(el => new Promise<string[]>(resolve => {
    const seen: string[] = []
    const tick = () => { seen.push(el.getAttribute('points') ?? ''); if (seen.length < 20) requestAnimationFrame(tick); else resolve(seen) }
    requestAnimationFrame(tick)
  }))
  const end = await finalPoints(page)
  expect(end).not.toBe(start)
  expect(frames.some(f => f !== start && f !== end)).toBe(true)
  await expect.poll(async () => {
    const [indicator, button] = await Promise.all([page.locator('.preset-indicator').boundingBox(), presets.nth(1).boundingBox()])
    return Math.abs((indicator?.x ?? 0) - (button?.x ?? 99))
  }).toBeLessThan(1)
})

test('reduced motion jumps straight to the final state', async ({ browser }) => {
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect.poll(() => page.locator('.eq-preview polyline').evaluate(el => getComputedStyle(el).strokeDashoffset)).toBe('0px')
  const curve = page.locator('.eq-preview polyline')
  await page.locator('.preview-presets button').nth(2).click()
  const after = await curve.evaluate(el => new Promise<string>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(el.getAttribute('points') ?? '')))))
  await page.waitForTimeout(600)
  expect(await curve.getAttribute('points')).toBe(after)
  await page.close()
})
