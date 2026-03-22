'use client'

import { useState } from 'react'

interface Photo {
  id: string
  countryCode: string
  url: string
  title: string | null
  date: string | null
  createdAt: string
}

interface PhotoGridProps {
  photos: Photo[]
  onDelete?: (photo: Photo) => void
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function PhotoGrid({ photos, onDelete }: PhotoGridProps) {
  const [lightbox, setLightbox] = useState<Photo | null>(null)

  if (photos.length === 0) return null

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className="photo-item"
            style={{
              animationDelay: `${i * 40}ms`,
              cursor: 'pointer',
              borderRadius: '10px',
              overflow: 'hidden',
              background: '#ede9e0',
              border: '1px solid #e4d8c1',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              position: 'relative',
            }}
            onClick={() => setLightbox(photo)}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(28,26,24,0.12)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
            }}
          >
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (lightbox?.id === photo.id) setLightbox(null)
                  onDelete(photo)
                }}
                title="Delete photo"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  zIndex: 10,
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(28,26,24,0.7)',
                  border: 'none',
                  color: '#f8f5ed',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(153,60,29,0.9)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(28,26,24,0.7)' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 4h10M5 4V2.5a1 1 0 011-1h2a1 1 0 011 1V4M6 7v4M8 7v4M3 4l1 10a1 1 0 001 1h6a1 1 0 001-1l1-10" />
                </svg>
              </button>
            )}
            <div style={{ position: 'relative', paddingBottom: '70%', background: '#d4cfc3' }}>
              <img
                src={photo.url}
                alt={photo.title || 'Travel photo'}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                loading="lazy"
              />
            </div>
            {(photo.title || photo.date) && (
              <div style={{ padding: '12px 14px' }}>
                {photo.title && (
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#322e2b',
                    margin: '0 0 2px',
                    lineHeight: 1.3,
                  }}>
                    {photo.title}
                  </p>
                )}
                {photo.date && (
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '12px',
                    color: '#9b9282',
                    margin: 0,
                  }}>
                    {formatDate(photo.date)}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(28,26,24,0.85)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setLightbox(null)}
        >
          <div
            style={{ position: 'relative', maxWidth: '900px', width: '100%' }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightbox.url}
              alt={lightbox.title || 'Travel photo'}
              style={{
                width: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '8px',
                display: 'block',
              }}
            />
            {(lightbox.title || lightbox.date) && (
              <div style={{
                marginTop: '16px',
                textAlign: 'center',
              }}>
                {lightbox.title && (
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '22px',
                    fontWeight: 400,
                    color: '#f8f5ed',
                    margin: '0 0 4px',
                  }}>
                    {lightbox.title}
                  </p>
                )}
                {lightbox.date && (
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    color: '#b8b1a1',
                    margin: 0,
                  }}>
                    {formatDate(lightbox.date)}
                  </p>
                )}
              </div>
            )}
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: 'absolute',
                top: '-12px',
                right: '-12px',
                background: '#322e2b',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                color: '#f8f5ed',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
