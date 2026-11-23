import { test, expect } from '@playwright/test'
import {
  FEATURED_DEVICES, buildDeviceContent, getDeviceDisplayName, getDeviceHighlights, getDeviceTraits, getTraitLevel,
} from '../src/lib/device-guides'
import { findDeviceById } from '../src/lib/device-db'
import { GUIDES } from '../src/lib/guides'
import eqApps from '../src/lib/guides/content/eq-apps'
import {
  SLIDER_STEPS, SWEEP_MAX_HZ, SWEEP_MIN_HZ, SWEEP_SECONDS,
  frequencyToSlider, levelFromSamples, sliderToFrequency, sweepFrequencyAt,
} from '../src/lib/tone-tools'
import type { DeviceProfile, EQBand } from '../src/lib/audio-store'

const LANGS = ['ko', 'en', 'zh', 'ja'] as const

test('every featured device exists in the DB and builds a page in all languages', () => {
  expect(new Set(FEATURED_DEVICES.map((d) => d.id)).size).toBe(FEATURED_DEVICES.length)
  for (const { id } of FEATURED_DEVICES) {
    const device = findDeviceById(id)
    expect(device, id).not.toBeNull()
    const content = buildDeviceContent(id)
    expect(content, id).not.toBeNull()
    for (const lang of LANGS) {
      const article = content![lang]
      expect(article.title).toContain(getDeviceDisplayName(id, lang))
      const eqTable = article.sections[1].blocks.find((b) => b.type === 'table')
      expect(eqTable && eqTable.type === 'table' ? eqTable.rows.length : 0).toBe(10)
      const applyList = article.sections[2].blocks[0]
      expect(applyList.type === 'list' ? applyList.items.length : 0, `${id} ${lang} apply steps`).toBeGreaterThan(0)
      expect(getDeviceHighlights(id, lang).length).toBeGreaterThan(0)
    }
  }
})

test('unknown device ids do not build pages', () => {
  expect(buildDeviceContent('not-a-device')).toBeNull()
  expect(buildDeviceContent('qcy-t13')).toBeNull() // DB에는 있지만 페이지 대상이 아님
})

test('traits invert the correction relative to the overall level: a bass cut means extra bass', () => {
  const band = (frequency: number, gain: number, type: EQBand['type'] = 'peaking'): EQBand => ({ frequency, gain, type })
  const device: DeviceProfile = {
    id: 'x', brand: 'X', name: 'X', alias: [], version: '1',
    baseEQ: [
      band(32, -6, 'lowshelf'), band(64, -4), band(125, 0), band(250, 0),
      band(500, 0), band(1000, 0), band(2000, 5), band(4000, 5), band(8000, 5), band(16000, 5, 'highshelf'),
    ],
  }
  const traits = getDeviceTraits(device)
  expect(traits).toEqual({ bass: 5, warmth: 0, vocal: 0, brightness: -5 })
  expect(getTraitLevel(traits.bass)).toBe('more')
  expect(getTraitLevel(traits.warmth)).toBe('close')
  expect(getTraitLevel(traits.brightness)).toBe('less')

  // 모든 밴드를 같은 양만큼 깎는 보정(전체 음량 차이)은 성향으로 나타나지 않아야 함
  const levelOnly = getDeviceTraits({ ...device, baseEQ: device.baseEQ.map((b) => ({ ...b, gain: -7 })) })
  expect(levelOnly).toEqual({ bass: 0, warmth: 0, vocal: 0, brightness: 0 })
})

test('eq-apps guide is registered and has content in every language', () => {
  expect(GUIDES.some((g) => g.slug === 'eq-apps')).toBe(true)
  for (const lang of LANGS) {
    expect(eqApps[lang].sections.length).toBeGreaterThanOrEqual(5)
    expect(GUIDES.find((g) => g.slug === 'eq-apps')!.title[lang]).toBe(eqApps[lang].title)
  }
})

test('log sweep and slider mapping cover 20 Hz to 20 kHz', () => {
  expect(sweepFrequencyAt(0)).toBeCloseTo(SWEEP_MIN_HZ)
  expect(sweepFrequencyAt(SWEEP_SECONDS)).toBeCloseTo(SWEEP_MAX_HZ)
  expect(sweepFrequencyAt(SWEEP_SECONDS / 2)).toBeCloseTo(Math.sqrt(SWEEP_MIN_HZ * SWEEP_MAX_HZ))
  expect(sweepFrequencyAt(-1)).toBeCloseTo(SWEEP_MIN_HZ)
  expect(sweepFrequencyAt(SWEEP_SECONDS * 2)).toBeCloseTo(SWEEP_MAX_HZ)
  expect(sliderToFrequency(0)).toBe(SWEEP_MIN_HZ)
  expect(sliderToFrequency(SLIDER_STEPS)).toBe(SWEEP_MAX_HZ)
  for (const hz of [20, 100, 1000, 8000, 20000]) {
    expect(Math.abs(sliderToFrequency(frequencyToSlider(hz)) - hz) / hz).toBeLessThan(0.01)
  }
})

test('mic level meter maps silence to 0 and full scale to 1', () => {
  expect(levelFromSamples(new Float32Array(512))).toBe(0)
  expect(levelFromSamples(new Float32Array(512).fill(1))).toBe(1)
  const quiet = levelFromSamples(new Float32Array(512).fill(0.01)) // -40 dBFS
  expect(quiet).toBeCloseTo(1 / 3, 2)
})
