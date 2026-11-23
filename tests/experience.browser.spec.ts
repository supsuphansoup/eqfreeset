import { test, expect, Page } from '@playwright/test'
import { encodeSharedEQ } from '../src/lib/result-share'
import { EQ_FREQUENCIES, filterCoefficients, responseDb } from '../src/lib/eq-processing'
import type { EQBand } from '../src/lib/audio-store'

const bands: EQBand[] = EQ_FREQUENCIES.map((frequency, i) => ({ frequency, gain: i % 2 ? -2 : 3, type: i === 0 ? 'lowshelf' : i === 9 ? 'highshelf' : 'peaking' }))

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => {
    const url = new URL(route.request().url())
    return url.hostname === '127.0.0.1' || ['blob:', 'data:'].includes(url.protocol) ? route.continue() : route.abort()
  })
})

async function noHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
}

test('home preview, themes, languages and keyboard focus work', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('내 귀니까')
  const curve = page.locator('.eq-preview polyline')
  const original = await curve.getAttribute('points')
  await page.getByRole('button', { name: '저음 풍부하게', exact: true }).click()
  await expect(curve).not.toHaveAttribute('points', original!)
  await expect(page.getByRole('button', { name: '저음 풍부하게', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await noHorizontalOverflow(page)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({ path: testInfo.outputPath('home-dark.png'), fullPage: true })
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await page.screenshot({ path: testInfo.outputPath('home-light.png'), fullPage: true })
  await page.getByRole('button', { name: 'Select Language' }).click()
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your ears')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await noHorizontalOverflow(page)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your ears')
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await page.getByRole('link', { name: 'Find my sound', exact: true }).focus()
  expect(await page.getByRole('link', { name: 'Find my sound', exact: true }).evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid')
  expect(errors).toEqual([])
})

test('search opens matching devices and an empty search has a recovery link', async ({ page }, testInfo) => {
  await page.goto('/test/')
  const search = page.getByRole('textbox', { name: '기기명 검색...' })
  await search.fill('WH-1000XM5')
  await expect(page.getByRole('button', { name: 'WH-1000XM5 Sony', exact: true })).toBeVisible()
  await noHorizontalOverflow(page)
  await page.screenshot({ path: testInfo.outputPath('device-search.png'), fullPage: true })
  await search.fill('not-a-real-model')
  await expect(page.getByText('해당 조건의 기기가 없습니다')).toBeVisible()
  await expect(page.getByRole('link', { name: '기기 추가 요청' })).toHaveAttribute('href', '/contact/')
  await search.fill('WH-1000XM5')
  await page.getByRole('button', { name: 'WH-1000XM5 Sony', exact: true }).click()
  await expect(page.getByText('선택한 기기')).toContainText('WH-1000XM5')
  await expect(page.locator('[aria-current="step"]')).toContainText('음원')
})

test('a shared result works in an empty browser and exports reproducible settings', async ({ page }, testInfo) => {
  const payload = encodeSharedEQ({ v: 1, device: '공유 테스트 헤드폰', bands, delta: bands })
  await page.goto(`/result/#eq=${payload}`)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('공유 테스트 헤드폰')
  await expect(page.getByText('공유받은 EQ 설정')).toBeVisible()
  await expect(page.getByText('권장 프리앰프')).toBeVisible()
  await noHorizontalOverflow(page)
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: '설정 다운로드', exact: true }).click()
  const download = await downloadPromise
  const stream = await download.createReadStream()
  const chunks: Buffer[] = []
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk))
  const exported = JSON.parse(Buffer.concat(chunks).toString())
  expect(exported.preampDb).toBeLessThan(0)
  expect(exported.referenceSampleRate).toBe(48000)
  expect(exported.bands[1].Q).toBe(1.4)
  expect(exported.bands[0].S).toBe(1)
  expect(exported.bands.map((b: EQBand) => b.gain)).toEqual(bands.map(b => b.gain))
  await page.screenshot({ path: testInfo.outputPath('result.png'), fullPage: true })
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('공유 테스트 헤드폰')
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => false })
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (value: string) => { (window as unknown as { copiedEQ: string }).copiedEQ = value } } })
  })
  const imageDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: '공유하기', exact: true }).click()
  expect((await imageDownload).suggestedFilename()).toMatch(/\.png$/)
  await expect(page.getByRole('status')).toContainText('결과 링크를 복사')
  const shareUrl = await page.evaluate(() => (window as unknown as { copiedEQ: string }).copiedEQ)
  expect(shareUrl).toContain('/result/#eq=')
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear() })
  await page.goto(shareUrl)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('공유 테스트 헤드폰')
})

test('broken links never silently show a different locally saved result', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('eqfreeset.results', JSON.stringify([{ id: 'other-result', deviceId: 'sony-wh-1000xm5', deviceName: 'Wrong result', personalizationDelta: [] }])))
  await page.goto('/result/?id=does-not-exist')
  await expect(page.getByText('결과를 불러올 수 없습니다.', { exact: false })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).not.toContainText('WH-1000XM5')
  await page.goto('/result/#eq=broken')
  await expect(page.getByText('결과를 불러올 수 없습니다.', { exact: false })).toBeVisible()
  await page.evaluate(() => localStorage.setItem('eqfreeset.results', JSON.stringify([{ id: 'broken-snapshot', deviceId: 'sony-wh-1000xm5', finalEQ: [{ frequency: 32, gain: 99 }] }])))
  await page.goto('/result/?id=broken-snapshot')
  await expect(page.getByText('결과를 불러올 수 없습니다.', { exact: false })).toBeVisible()
})

test('filter coefficient calculations match the browser audio engine', async ({ page }) => {
  await page.goto('/')
  for (const sampleRate of [44100, 48000]) {
    const measured = await page.evaluate(({ bands, sampleRate }) => {
      const context = new OfflineAudioContext(1, 128, sampleRate)
      const frequencies = new Float32Array([20, 32, 64, 125, 500, 1000, 2000, 8000, 16000, 20000])
      return bands.map(band => {
        const filter = context.createBiquadFilter()
        filter.type = band.type
        filter.frequency.value = band.frequency
        filter.Q.value = 1.4
        filter.gain.value = band.gain
        const magnitude = new Float32Array(frequencies.length)
        filter.getFrequencyResponse(frequencies, magnitude, new Float32Array(frequencies.length))
        return Array.from(magnitude, m => 20 * Math.log10(m))
      })
    }, { bands, sampleRate })
    bands.forEach((band, i) => {
      const coeffs = filterCoefficients(band, sampleRate)
      ;[20, 32, 64, 125, 500, 1000, 2000, 8000, 16000, 20000].forEach((f, j) => expect(responseDb(coeffs, f, sampleRate)).toBeCloseTo(measured[i][j], 3))
    })
  }
})

function sampleWav(silent = false, seconds = 3) {
  const rate = 48000
  const frames = rate * seconds
  const buffer = Buffer.alloc(44 + frames * 2)
  buffer.write('RIFF', 0); buffer.writeUInt32LE(buffer.length - 8, 4); buffer.write('WAVEfmt ', 8)
  buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22)
  buffer.writeUInt32LE(rate, 24); buffer.writeUInt32LE(rate * 2, 28); buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34)
  buffer.write('data', 36); buffer.writeUInt32LE(frames * 2, 40)
  if (!silent) for (let i = 0; i < frames; i++) buffer.writeInt16LE(Math.round(5000 * Math.sin(2 * Math.PI * 220 * i / rate) + 5000 * Math.sin(2 * Math.PI * 2200 * i / rate)), 44 + i * 2)
  return buffer
}

test('upload, comparison, storage failure, backup, retry and reload work end to end', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    const state = window as unknown as { comparisonPlays: Array<{ rms: number; peak: number; id: number }> }
    state.comparisonPlays = []
    const seen: AudioBuffer[] = []
    const original = AudioBufferSourceNode.prototype.start
    AudioBufferSourceNode.prototype.start = function (...args) {
      if (this.context instanceof AudioContext && this.buffer) {
        const buffer = this.buffer
        let power = 0, peak = 0
        for (let c = 0; c < buffer.numberOfChannels; c++) for (const sample of buffer.getChannelData(c)) {
          power += sample * sample
          peak = Math.max(peak, Math.abs(sample))
        }
        if (!seen.includes(buffer)) seen.push(buffer)
        state.comparisonPlays.push({ rms: Math.sqrt(power / (buffer.length * buffer.numberOfChannels)), peak, id: seen.indexOf(buffer) })
      }
      original.apply(this, args)
    }
  })
  await page.goto('/test/')
  await page.getByRole('textbox').fill('WH-1000XM5')
  await page.getByRole('button', { name: 'WH-1000XM5 Sony', exact: true }).click()
  await page.getByRole('button', { name: /음원 업로드/ }).click()
  const chooserPromise = page.waitForEvent('filechooser')
  await page.getByRole('button', { name: '파일 선택', exact: true }).focus()
  await page.keyboard.press('Enter')
  await (await chooserPromise).setFiles({ name: 'comparison.wav', mimeType: 'audio/wav', buffer: sampleWav() })
  await expect(page.getByText('모든 음역대 분석 완료')).toBeVisible()
  await page.getByRole('button', { name: '테스트 시작', exact: true }).click()
  await expect(page.getByRole('button', { name: 'A가 더 좋음' })).toBeDisabled()
  for (let round = 0; round < 16; round++) {
    if (page.url().includes('/result')) break
    const playCount = await page.evaluate(() => (window as unknown as { comparisonPlays: unknown[] }).comparisonPlays.length)
    await page.locator('.choice-card').nth(0).click()
    await expect.poll(() => page.evaluate(() => (window as unknown as { comparisonPlays: unknown[] }).comparisonPlays.length)).toBe(playCount + 1)
    await expect(page.locator('.choice-card').nth(0)).toHaveClass(/choice-card-active/)
    await page.waitForTimeout(1150)
    await page.locator('.choice-card').nth(1).click()
    await expect.poll(() => page.evaluate(() => (window as unknown as { comparisonPlays: unknown[] }).comparisonPlays.length)).toBe(playCount + 2)
    await page.waitForTimeout(1150)
    const similar = page.getByRole('button', { name: '둘 다 비슷하게 좋음', exact: true })
    await expect(similar).toBeEnabled()
    if (round === 0) {
      await noHorizontalOverflow(page)
      await page.screenshot({ path: testInfo.outputPath('comparison.png'), fullPage: true })
    }
    const levels = await page.evaluate(() => (window as unknown as { comparisonPlays: Array<{ rms: number; peak: number }> }).comparisonPlays.slice(-2))
    expect(Math.abs(20 * Math.log10(levels[0].rms / levels[1].rms))).toBeLessThan(0.001)
    expect(Math.max(...levels.map(level => level.peak))).toBeLessThanOrEqual(Math.pow(10, -1 / 20) + 1e-6)
    if (round === 0) {
      await page.locator('.choice-card').nth(1).click() // stop B
      await page.locator('.choice-card').nth(0).click() // replay A
      await expect.poll(() => page.evaluate(() => (window as unknown as { comparisonPlays: unknown[] }).comparisonPlays.length)).toBe(playCount + 3)
      const ids = await page.evaluate(() => (window as unknown as { comparisonPlays: Array<{ id: number }> }).comparisonPlays.slice(-3).map(play => play.id))
      expect(ids[2]).toBe(ids[0])
      await page.getByRole('button', { name: '판단 어려움 · 건너뛰기', exact: true }).click()
    }
    else await similar.click()
    await page.waitForTimeout(80)
  }
  await expect(page.getByRole('heading', { name: '저장 전에 한 번 더 들어보세요', exact: true })).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  expect(await page.evaluate(() => localStorage.getItem('eqfreeset.results'))).toBeNull()
  await expect(page.getByRole('button', { name: 'A로 저장', exact: true })).toBeDisabled()
  await expect(page.getByRole('button', { name: '8회 더 비교하기', exact: true })).toBeVisible()
  await noHorizontalOverflow(page)
  await page.screenshot({ path: testInfo.outputPath('final-review.png'), fullPage: true })
  // Undo from the review must return to the same last pair, requiring a fresh listen.
  await page.getByRole('button', { name: '직전 선택 취소', exact: true }).click()
  await expect(page.getByRole('button', { name: '둘 다 비슷하게 좋음', exact: true })).toBeDisabled()
  for (const option of [0, 1]) {
    await page.locator('.choice-card').nth(option).click()
    await page.waitForTimeout(1250)
  }
  await page.getByRole('button', { name: '둘 다 비슷하게 좋음', exact: true }).click()
  await expect(page.getByRole('heading', { name: '저장 전에 한 번 더 들어보세요', exact: true })).toBeVisible()
  for (const option of [0, 1]) {
    await page.locator('.choice-card').nth(option).click()
    await page.waitForTimeout(1250)
  }
  const reviewLevels = await page.evaluate(() => (window as unknown as { comparisonPlays: Array<{ rms: number; peak: number }> }).comparisonPlays.slice(-2))
  expect(Math.abs(20 * Math.log10(reviewLevels[0].rms / reviewLevels[1].rms))).toBeLessThan(0.001)
  await page.evaluate(() => {
    const state = window as unknown as { resultStorageBlocked: boolean }
    state.resultStorageBlocked = true
    const setItem = Storage.prototype.setItem
    Storage.prototype.setItem = function (key, value) {
      if (this === localStorage && key === 'eqfreeset.results' && state.resultStorageBlocked) throw new DOMException('Storage full', 'QuotaExceededError')
      setItem.call(this, key, value)
    }
  })
  await page.getByRole('button', { name: 'A로 저장', exact: true }).click()
  await expect(page).toHaveURL(/\/result\/?\?id=/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('WH-1000XM5')
  const storageAlert = page.getByRole('alert').filter({ hasText: '브라우저에 결과를 저장하지 못했습니다.' })
  await expect(storageAlert).toContainText('브라우저에 결과를 저장하지 못했습니다.')
  expect(await page.evaluate(() => localStorage.getItem('eqfreeset.results'))).toBeNull()
  await noHorizontalOverflow(page)
  await page.screenshot({ path: testInfo.outputPath('storage-recovery.png'), fullPage: true })
  const backupPromise = page.waitForEvent('download')
  await storageAlert.getByRole('button', { name: '설정 다운로드', exact: true }).click()
  const stream = await (await backupPromise).createReadStream()
  const chunks: Buffer[] = []
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk))
  const backup = JSON.parse(Buffer.concat(chunks).toString())
  await storageAlert.getByRole('button', { name: '다시 저장', exact: true }).click()
  await expect(storageAlert).toBeVisible()
  await page.evaluate(() => { (window as unknown as { resultStorageBlocked: boolean }).resultStorageBlocked = false })
  await storageAlert.getByRole('button', { name: '다시 저장', exact: true }).click()
  await expect(storageAlert).not.toBeVisible()
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('eqfreeset.results')!)[0])
  expect(backup.bands.map((b: EQBand) => b.gain)).toEqual(saved.finalEQ.map((b: EQBand) => b.gain))
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('eqfreeset.results')!).length)).toBe(1)
  expect(saved.completedRounds).toBeLessThanOrEqual(16)
  expect(saved.responses.length).toBe(saved.completedRounds)
  expect(saved.schemaVersion).toBe(2)
  expect(saved.algorithmVersion).toBe('preference-grid-v3')
  expect(saved.finalReview.choice).toBe(saved.finalReview.aIsPersonalized ? 'personalized' : 'base')
  expect(saved.finalEQ).toHaveLength(10)
  expect(saved.baseEQSnapshot).toHaveLength(10)
  expect(saved.responses[0].choice).toBe('unsure')
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('WH-1000XM5')
  await expect(page.getByRole('status')).toContainText('판단을 건너뛴 항목')
  expect(errors).toEqual([])
})

test('a saved final EQ snapshot survives a changed device preset', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(({ bands }) => localStorage.setItem('eqfreeset.results', JSON.stringify([{
    id: 'snapshot-test', deviceId: 'sony-wh-1000xm5', deviceName: 'Snapshot',
    schemaVersion: 2, personalizationDelta: bands.map(b => ({ ...b, gain: 0 })),
    finalEQ: bands, responses: [],
  }])), { bands })
  await page.goto('/result/?id=snapshot-test')
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: '설정 다운로드', exact: true }).click()
  const stream = await (await downloadPromise).createReadStream()
  const chunks: Buffer[] = []
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk))
  expect(JSON.parse(Buffer.concat(chunks).toString()).bands.map((b: EQBand) => b.gain)).toEqual(bands.map(b => b.gain))
})

test('silent audio is recoverable and never marked as heard', async ({ page }) => {
  await page.goto('/test/')
  await page.getByRole('textbox').fill('WH-1000XM5')
  await page.getByRole('button', { name: 'WH-1000XM5 Sony', exact: true }).click()
  await page.getByRole('button', { name: /음원 업로드/ }).click()
  await page.locator('input[type=file]').setInputFiles({ name: 'silent.wav', mimeType: 'audio/wav', buffer: sampleWav(true) })
  await expect(page.getByText('모든 음역대 분석 완료')).toBeVisible()
  await page.getByRole('button', { name: '테스트 시작', exact: true }).click()
  await page.locator('.choice-card').nth(0).click()
  await expect(page.getByText('이 구간은 너무 조용해 비교할 수 없습니다.', { exact: false })).toBeVisible()
  await expect(page.getByRole('button', { name: 'A가 더 좋음', exact: true })).toBeDisabled()
  await expect(page.getByRole('button', { name: '판단 어려움 · 건너뛰기', exact: true })).toBeDisabled()
  await page.locator('header button').first().click()
  await expect(page.getByRole('button', { name: '파일 선택', exact: true })).toBeVisible()
})

test('changing a manual segment discards audio still being prepared for the old segment', async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as unknown as { releaseRender: () => void; comparisonStarts: number; renderWaiting: boolean }
    state.comparisonStarts = 0
    state.renderWaiting = false
    const gate = new Promise<void>(resolve => { state.releaseRender = resolve })
    const render = OfflineAudioContext.prototype.startRendering
    OfflineAudioContext.prototype.startRendering = async function () {
      const audio = await render.call(this)
      state.renderWaiting = true
      await gate
      return audio
    }
    const start = AudioBufferSourceNode.prototype.start
    AudioBufferSourceNode.prototype.start = function (...args) {
      if (this.context instanceof AudioContext) state.comparisonStarts++
      start.apply(this, args)
    }
  })
  await page.goto('/test/')
  await page.getByRole('textbox').fill('WH-1000XM5')
  await page.getByRole('button', { name: 'WH-1000XM5 Sony', exact: true }).click()
  await page.getByRole('button', { name: /음원 업로드/ }).click()
  await page.locator('input[type=file]').setInputFiles({ name: 'longer.wav', mimeType: 'audio/wav', buffer: sampleWav(false, 12) })
  await expect(page.getByText('모든 음역대 분석 완료')).toBeVisible()
  await page.getByRole('button', { name: /직접 구간/ }).click()
  await page.getByRole('button', { name: '테스트 시작', exact: true }).click()
  await page.locator('.choice-card').nth(0).click()
  await expect.poll(() => page.evaluate(() => (window as unknown as { renderWaiting: boolean }).renderWaiting)).toBe(true)
  await page.getByRole('slider').focus()
  await page.keyboard.press('ArrowRight')
  await page.evaluate(() => (window as unknown as { releaseRender: () => void }).releaseRender())
  await expect(page.locator('.choice-card').nth(0)).toBeEnabled()
  expect(await page.evaluate(() => (window as unknown as { comparisonStarts: number }).comparisonStarts)).toBe(0)
  await expect(page.getByRole('button', { name: 'A가 더 좋음', exact: true })).toBeDisabled()
  await page.locator('.choice-card').nth(0).click()
  await expect.poll(() => page.evaluate(() => (window as unknown as { comparisonStarts: number }).comparisonStarts)).toBe(1)
})

test('back navigation cancels pending decoding and a fresh upload can complete', async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as unknown as { releaseDecode: () => void; decodeWaiting: boolean }
    state.decodeWaiting = false
    const gate = new Promise<void>(resolve => { state.releaseDecode = resolve })
    const decode = AudioContext.prototype.decodeAudioData
    AudioContext.prototype.decodeAudioData = async function (data) {
      const buffer = await decode.call(this, data)
      state.decodeWaiting = true
      await gate
      return buffer
    }
  })
  await page.goto('/test/')
  await page.getByRole('textbox').fill('WH-1000XM5')
  await page.getByRole('button', { name: 'WH-1000XM5 Sony', exact: true }).click()
  await page.getByRole('button', { name: /음원 업로드/ }).click()
  await page.locator('input[type=file]').setInputFiles({ name: 'cancelled.wav', mimeType: 'audio/wav', buffer: sampleWav() })
  await expect.poll(() => page.evaluate(() => (window as unknown as { decodeWaiting: boolean }).decodeWaiting)).toBe(true)
  await page.locator('header button').first().click()
  await expect(page.getByRole('button', { name: /음원 업로드/ })).toBeVisible()
  await page.getByRole('button', { name: /음원 업로드/ }).click()
  await page.evaluate(() => (window as unknown as { releaseDecode: () => void }).releaseDecode())
  await expect(page.getByRole('button', { name: '파일 선택', exact: true })).toBeEnabled()
  await expect(page.getByText('모든 음역대 분석 완료')).not.toBeVisible()
  await expect(page.getByText('cancelled.wav', { exact: true })).not.toBeVisible()
  await page.locator('input[type=file]').setInputFiles({ name: 'fresh-short.wav', mimeType: 'audio/wav', buffer: sampleWav(false, 0.75) })
  await expect(page.getByText('모든 음역대 분석 완료')).toBeVisible()
  await page.getByRole('button', { name: '테스트 시작', exact: true }).click()
  await page.locator('.choice-card').nth(0).click()
  await page.waitForTimeout(450)
  await page.locator('.choice-card').nth(1).click()
  await expect(page.getByRole('button', { name: 'A가 더 좋음', exact: true })).toBeEnabled()
})

test('an obsolete comparison cannot unlock a newer upload still decoding', async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as unknown as {
      releaseRender: () => void; releaseDecode: () => void;
      renderWaiting: boolean; blockDecode: boolean; decodeWaiting: boolean;
    }
    state.renderWaiting = false
    state.blockDecode = false
    state.decodeWaiting = false
    const renderGate = new Promise<void>(resolve => { state.releaseRender = resolve })
    const decodeGate = new Promise<void>(resolve => { state.releaseDecode = resolve })
    const render = OfflineAudioContext.prototype.startRendering
    OfflineAudioContext.prototype.startRendering = async function () {
      const buffer = await render.call(this)
      state.renderWaiting = true
      await renderGate
      return buffer
    }
    const decode = AudioContext.prototype.decodeAudioData
    AudioContext.prototype.decodeAudioData = async function (data) {
      const buffer = await decode.call(this, data)
      if (state.blockDecode) { state.decodeWaiting = true; await decodeGate }
      return buffer
    }
  })
  await page.goto('/test/')
  await page.getByRole('textbox').fill('WH-1000XM5')
  await page.getByRole('button', { name: 'WH-1000XM5 Sony', exact: true }).click()
  await page.getByRole('button', { name: /음원 업로드/ }).click()
  await page.locator('input[type=file]').setInputFiles({ name: 'old.wav', mimeType: 'audio/wav', buffer: sampleWav() })
  await expect(page.getByText('모든 음역대 분석 완료')).toBeVisible()
  await page.getByRole('button', { name: '테스트 시작', exact: true }).click()
  await page.locator('.choice-card').nth(0).click()
  await expect.poll(() => page.evaluate(() => (window as unknown as { renderWaiting: boolean }).renderWaiting)).toBe(true)
  await page.locator('header button').first().click()
  await page.locator('header button').first().click()
  await page.getByRole('button', { name: /음원 업로드/ }).click()
  await page.evaluate(() => { (window as unknown as { blockDecode: boolean }).blockDecode = true })
  await page.locator('input[type=file]').setInputFiles({ name: 'new.wav', mimeType: 'audio/wav', buffer: sampleWav() })
  await expect.poll(() => page.evaluate(() => (window as unknown as { decodeWaiting: boolean }).decodeWaiting)).toBe(true)
  await page.evaluate(async () => {
    (window as unknown as { releaseRender: () => void }).releaseRender()
    await new Promise(resolve => setTimeout(resolve, 200))
  })
  await expect(page.getByRole('button', { name: '파일 선택', exact: true })).toBeDisabled()
  await expect(page.getByText('모든 음역대 분석 완료')).not.toBeVisible()
  await page.evaluate(() => (window as unknown as { releaseDecode: () => void }).releaseDecode())
  await expect(page.getByText('모든 음역대 분석 완료')).toBeVisible()
})
