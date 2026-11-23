import type { EQBand } from './audio-store'
import { EQ_FREQUENCIES } from './eq-processing'

export interface SharedEQ {
  v: 1
  device: string
  bands: EQBand[]
  delta: EQBand[]
}

export function validBands(value: unknown): value is EQBand[] {
  return Array.isArray(value) && value.length === 10 && value.every((b, i) =>
    b && b.frequency === EQ_FREQUENCIES[i] && typeof b.gain === 'number' &&
    Number.isFinite(b.gain) && Math.abs(b.gain) <= 10 &&
    b.type === (i === 0 ? 'lowshelf' : i === 9 ? 'highshelf' : 'peaking'))
}

export function encodeSharedEQ(value: SharedEQ): string {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  return btoa(Array.from(bytes, b => String.fromCharCode(b)).join('')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeSharedEQ(value: string): SharedEQ | null {
  if (!value || value.length > 8000 || !/^[A-Za-z0-9_-]+$/.test(value)) return null
  try {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(base64 + '='.repeat((4 - base64.length % 4) % 4))
    const data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(decoded, c => c.charCodeAt(0))))
    if (data.v !== 1 || typeof data.device !== 'string' || !data.device.trim() || data.device.length > 160 || !validBands(data.bands) || !validBands(data.delta)) return null
    return { v: 1, device: data.device, bands: data.bands, delta: data.delta }
  } catch {
    return null
  }
}
