// ESM wrapper for the UMD steganography library to ensure it's bundled
import './steganography.js'

const getGlobal = (): any => {
  if (typeof globalThis !== 'undefined') return globalThis as any
  if (typeof window !== 'undefined') return window as any
  if (typeof self !== 'undefined') return self as any
  return {}
}

const steg = (getGlobal()).steg
export default steg
