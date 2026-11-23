import { test, expect } from '@playwright/test'
import { useTestStore, type TestResult } from '../src/lib/audio-store'
import { getAllDevices } from '../src/lib/device-db'

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
let contents: string | null, blocked: boolean

test.beforeEach(() => {
  contents = null
  blocked = false
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {} })
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: () => contents,
    setItem: (_key: string, value: string) => {
      if (blocked) throw new DOMException('Storage is full', 'QuotaExceededError')
      contents = value
    },
  } })
  useTestStore.getState().resetTest()
  useTestStore.getState().setSelectedDevice(getAllDevices()[0])
  useTestStore.getState().setManualMode(true)
  useTestStore.getState().setSelectedSegment({ start: 0, duration: 3 })
  useTestStore.setState({ currentStep: 'test' })
  for (let i = 0; i < 16; i++) useTestStore.getState().processResponse('similar')
})

test.afterEach(() => {
  useTestStore.getState().resetTest()
  if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow)
  else Reflect.deleteProperty(globalThis, 'window')
  if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage)
  else Reflect.deleteProperty(globalThis, 'localStorage')
})

test('storage failure retains the confirmed result and permits a safe retry', () => {
  blocked = true
  useTestStore.getState().confirmResult('A')
  const result = useTestStore.getState().testResult!
  expect(useTestStore.getState().isTestComplete).toBe(true)
  expect(useTestStore.getState().resultPersisted).toBe(false)
  expect(contents).toBeNull()
  useTestStore.getState().retrySaveResult()
  expect(useTestStore.getState().resultPersisted).toBe(false)
  blocked = false
  useTestStore.getState().retrySaveResult()
  useTestStore.getState().retrySaveResult()
  expect(useTestStore.getState().resultPersisted).toBe(true)
  expect(useTestStore.getState().testResult).toBe(result)
  expect(JSON.parse(contents!)).toEqual([result])
})

test('saving caps imported histories at 50 without duplicating the current result', () => {
  const draft = useTestStore.getState().testResult!
  contents = JSON.stringify(Array.from({ length: 80 }, (_, i) => ({ ...draft, id: `older-${i}` })))
  useTestStore.getState().confirmResult('B')
  const stored: TestResult[] = JSON.parse(contents!)
  expect(stored).toHaveLength(50)
  expect(stored[0]).toEqual(useTestStore.getState().testResult)
  expect(stored[49].id).toBe('older-48')
})

test('blocked storage reads retain the confirmed result without claiming persistence', () => {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get: () => { throw new DOMException('Blocked', 'SecurityError') } })
  useTestStore.getState().confirmResult('B')
  expect(useTestStore.getState().currentStep).toBe('result')
  expect(useTestStore.getState().testResult!.finalEQ).toHaveLength(10)
  expect(useTestStore.getState().resultPersisted).toBe(false)
})
