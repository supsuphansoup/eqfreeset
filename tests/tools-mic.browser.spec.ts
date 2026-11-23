import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const url = new URL(route.request().url())
    return url.hostname === '127.0.0.1' || ['blob:', 'data:'].includes(url.protocol) ? route.continue() : route.abort()
  })
})

// 가짜 마이크: Chromium의 가짜 마이크(일정한 비프음)와 자동 권한 허용으로 실제 권한 창 없이 검증한다
test.use({
  permissions: ['microphone'],
  launchOptions: { args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] },
})

test('mic level moves, a 5-second recording plays back and the mic turns off', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/tools/')
  await page.getByRole('button', { name: '마이크 켜기' }).click()
  const meter = page.getByRole('meter', { name: '입력 레벨' })
  // 가짜 마이크는 짧은 비프음을 간헐적으로 내므로, 레벨 값의 변화를 계속 지켜보며 최댓값을 확인한다
  const peak = await meter.evaluate((el) => new Promise<number>((resolve) => {
    let max = Number(el.getAttribute('aria-valuenow'))
    const observer = new MutationObserver(() => { max = Math.max(max, Number(el.getAttribute('aria-valuenow'))) })
    observer.observe(el, { attributes: true, attributeFilter: ['aria-valuenow'] })
    setTimeout(() => { observer.disconnect(); resolve(max) }, 4000)
  }))
  expect(peak).toBeGreaterThan(0)

  await page.getByRole('button', { name: '5초 녹음' }).click()
  await expect(page.getByRole('button', { name: '녹음 중…' })).toBeDisabled()
  const audio = page.locator('audio[controls]')
  await expect(audio).toHaveAttribute('src', /^blob:/, { timeout: 12000 })
  await expect.poll(() => audio.evaluate((el: HTMLAudioElement) => new Promise<number>(resolve => {
    if (el.readyState >= 1) return resolve(el.duration)
    el.addEventListener('loadedmetadata', () => resolve(el.duration), { once: true })
  })), { timeout: 10000 }).toBeGreaterThan(0)

  await page.getByRole('button', { name: '마이크 끄기' }).click()
  await expect(page.getByRole('button', { name: '마이크 켜기' })).toBeVisible()
  await expect(page.locator('p[role="alert"]')).toHaveCount(0) // Next 기본 route announcer(role=alert)는 제외
  expect(errors).toEqual([])
})
