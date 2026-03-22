'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import PhotoUploadForm from '@/components/PhotoUploadForm'
import PhotoGrid from '@/components/PhotoGrid'
import EmptyState from '@/components/EmptyState'

interface Photo {
  id: string
  countryCode: string
  url: string
  title: string | null
  date: string | null
  createdAt: string
}

interface Country {
  code: string
  name: string
}

interface CountryClientProps {
  country: Country
  initialPhotos: Photo[]
}

export default function CountryClient({ country, initialPhotos }: CountryClientProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
  const [showUpload, setShowUpload] = useState(false)

  const handleUploadSuccess = (photo: Photo) => {
    setPhotos(prev => [photo, ...prev])
    setShowUpload(false)
  }

  const handleDelete = async (photo: Photo) => {
    const res = await fetch(`/api/photos/${photo.id}`, { method: 'DELETE' })
    if (res.ok) {
      setPhotos(prev => prev.filter(p => p.id !== photo.id))
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8f5ed' }}>
      {/* Header */}
      <header style={{
        padding: '28px 48px 24px',
        borderBottom: '1px solid #e4d8c1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Back link */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              color: '#7e7568',
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1c1a18')}
            onMouseLeave={e => (e.currentTarget.style.color = '#7e7568')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3L5 8l5 5" />
            </svg>
            World map
          </Link>

          <span style={{ color: '#d4cfc3', fontSize: '18px' }}>·</span>

          <div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '28px',
              fontWeight: 400,
              color: '#1c1a18',
              margin: 0,
              lineHeight: 1.1,
            }}>
              {country.name}
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              color: '#9b9282',
              margin: '3px 0 0',
              letterSpacing: '0.05em',
            }}>
              {photos.length === 0
                ? 'No photos yet'
                : `${photos.length} photo${photos.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Upload button when photos exist - single entry point for this state */}
        {photos.length > 0 && (
          <button
            onClick={() => setShowUpload(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: '#322e2b',
              color: '#f8f5ed',
              border: 'none',
              borderRadius: '8px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#4a4440')}
            onMouseLeave={e => (e.currentTarget.style.background = '#322e2b')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M8 2v8M4 6l4-4 4 4M2 12h12" />
            </svg>
            Upload photo
          </button>
        )}
      </header>

      {/* Content */}
      <div style={{ padding: '40px 48px' }}>
        {photos.length === 0 ? (
          <EmptyState
            countryName={country.name}
            onUploadClick={() => setShowUpload(true)}
          />
        ) : (
          <PhotoGrid photos={photos} onDelete={handleDelete} />
        )}
      </div>

      {/* Upload modal - opens directly when triggered (no extra button) */}
      {showUpload && (
        <PhotoUploadForm
          countryCode={country.code}
          onUploadSuccess={handleUploadSuccess}
          initialOpen
          onClose={() => setShowUpload(false)}
        />
      )}
    </main>
  )
}
