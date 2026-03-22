'use client'

import { useState, useRef, useCallback } from 'react'

interface Photo {
  id: string
  countryCode: string
  url: string
  title: string | null
  date: string | null
  createdAt: string
}

interface PhotoUploadFormProps {
  countryCode: string
  onUploadSuccess: (photo: Photo) => void
  initialOpen?: boolean
  onClose?: () => void
}

export default function PhotoUploadForm({ countryCode, onUploadSuccess, initialOpen = false, onClose }: PhotoUploadFormProps) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    setError(null)
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setError('Please select a JPG, PNG, or WebP image.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.')
      return
    }
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('countryCode', countryCode)
      if (title.trim()) formData.append('title', title.trim())
      if (date) formData.append('date', date)

      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      onUploadSuccess(data.photo)
      // Reset
      setIsOpen(false)
      setSelectedFile(null)
      setPreview(null)
      setTitle('')
      setDate('')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setUploading(false)
    }
  }

  const reset = () => {
    setSelectedFile(null)
    setPreview(null)
    setTitle('')
    setDate('')
    setError(null)
    setIsOpen(false)
    onClose?.()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(28,26,24,0.5)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) reset() }}
    >
      <div
        style={{
          background: '#fdfcf8',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '480px',
          padding: '32px',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '22px',
            fontWeight: 400,
            color: '#1c1a18',
            margin: 0,
          }}>
            Add a photo
          </h2>
          <button
            onClick={reset}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#7e7568',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Drop zone */}
          <div
            className={`upload-zone${isDragging ? ' drag-over' : ''}`}
            style={{
              borderRadius: '10px',
              padding: '24px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '20px',
              overflow: 'hidden',
              position: 'relative',
              minHeight: preview ? 'auto' : '140px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !preview && fileInputRef.current?.click()}
          >
            {preview ? (
              <div style={{ position: 'relative', width: '100%' }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: '100%', maxHeight: '220px', objectFit: 'contain', borderRadius: '6px' }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFile(null)
                    setPreview(null)
                  }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(28,26,24,0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    color: '#f8f5ed',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M3 3l8 8M11 3L3 11" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#c0a97c" strokeWidth="1.2" strokeLinecap="round" style={{ marginBottom: '10px' }}>
                  <rect x="4" y="8" width="28" height="22" rx="3" />
                  <circle cx="13" cy="17" r="3" />
                  <path d="M4 24l7-6 5 5 4-4 8 7" />
                </svg>
                <p style={{ color: '#7e7568', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', margin: '0 0 4px' }}>
                  Drop your photo here
                </p>
                <p style={{ color: '#b8b1a1', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', margin: 0 }}>
                  or click to browse — JPG, PNG, WebP up to 10MB
                </p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7e7568', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Title <span style={{ opacity: 0.5 }}>(optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Sunset in Santorini"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1.5px solid #e4d8c1',
                  borderRadius: '8px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px',
                  color: '#1c1a18',
                  background: '#fdfcf8',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#4b8fa8')}
                onBlur={e => (e.target.style.borderColor = '#e4d8c1')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7e7568', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Date taken <span style={{ opacity: 0.5 }}>(optional)</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1.5px solid #e4d8c1',
                  borderRadius: '8px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px',
                  color: '#1c1a18',
                  background: '#fdfcf8',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#4b8fa8')}
                onBlur={e => (e.target.style.borderColor = '#e4d8c1')}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              color: '#993c1d',
              background: '#faece7',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
            }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!selectedFile || uploading}
            style={{
              width: '100%',
              padding: '12px',
              background: (!selectedFile || uploading) ? '#d4cfc3' : '#322e2b',
              color: (!selectedFile || uploading) ? '#9b9282' : '#f8f5ed',
              border: 'none',
              borderRadius: '8px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              cursor: (!selectedFile || uploading) ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              letterSpacing: '0.01em',
            }}
          >
            {uploading ? 'Uploading...' : 'Save photo'}
          </button>
        </form>
      </div>
    </div>
  )
}
