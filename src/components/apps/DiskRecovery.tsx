import React, { useCallback, useMemo, useRef, useState } from 'react'
// Ensure the UMD steganography library executes and attaches to window/globalThis
import '~/library/steganography.js'
import styles from '~/terminal/App/App.module.scss'

type DecodeState = 'idle' | 'loading' | 'done' | 'error'

export default function DiskRecovery() {
  const [status, setStatus] = useState<DecodeState>('idle')
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const steg: any = useMemo(() => {
    const g: any = (typeof globalThis !== 'undefined') ? globalThis : (typeof window !== 'undefined' ? window : {})
    return g.steg
  }, [])

  const onSelectFile = useCallback(async (file: File) => {
    setError('')
    setMessage('')
    setStatus('loading')
    try {
      const reader = new FileReader()
      const url: string = await new Promise((resolve, reject) => {
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
      setPreviewUrl(url)

      // Create an HTMLImageElement for the library API
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = () => reject(new Error('Failed to load image'))
        image.src = url
      })

      if (!steg || typeof steg.decode !== 'function') {
        throw new Error('Steganography library not available')
      }

      const result: string = steg.decode(img)
      setMessage(result || '(No hidden message found)')
      setStatus('done')
    } catch (e: any) {
      setError(e?.message || 'Decoding failed')
      setStatus('error')
    }
  }, [steg])

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onSelectFile(file)
  }, [onSelectFile])

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) onSelectFile(file)
  }, [onSelectFile])

  const onBrowse = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className={styles.mainContent} style={{ height: '100%', padding: 12, backgroundColor: 'rgba(18,18,20,0.9)', backdropFilter: 'blur(8px)' }}>
      <div style={{ display: 'flex', gap: 16, height: '100%' }}>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={onBrowse}
          style={{
            flex: 1,
            minWidth: 260,
            border: '1px dashed #5a5a5a',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.03)'
          }}
          title="Click or drop an image to decode"
        >
          {!previewUrl && (
            <div style={{ textAlign: 'center', color: '#bbb' }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>Disk Recovery</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Click to select or drop a stego image here</div>
            </div>
          )}
          {previewUrl && (
            <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onInputChange}
            style={{ display: 'none' }}
          />
          {status === 'loading' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)', color: '#fff' }}>
              Decoding…
            </div>
          )}
        </div>

        <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ color: '#ddd', fontWeight: 600 }}>Output</div>
          <div style={{ flex: 1, border: '1px solid #2d2d2d', background: '#0f0f12', borderRadius: 8, padding: 12, overflow: 'auto', whiteSpace: 'pre-wrap', color: '#d6e2ff' }}>
            {status === 'idle' && <span style={{ opacity: 0.6 }}>No image loaded.</span>}
            {status === 'error' && <span style={{ color: '#ff8a80' }}>{error}</span>}
            {status === 'done' && <span>{message}</span>}
            {status === 'loading' && <span style={{ opacity: 0.8 }}>Working…</span>}
          </div>
          <div style={{ fontSize: 12, color: '#8aa0b4' }}>
            • Scan lost images from the HECK archive to discover hidden meanings. <br />
            • Supported: common image formats (PNG/JPEG). If nothing appears, the image may not contain hidden data.
          </div>
        </div>
      </div>
    </div>
  )
}
