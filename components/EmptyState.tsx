'use client'

interface EmptyStateProps {
  countryName: string
  onUploadClick: () => void
}

export default function EmptyState({ countryName, onUploadClick }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      textAlign: 'center',
    }}>
      {/* Illustrated camera */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        style={{ marginBottom: '24px', opacity: 0.4 }}
      >
        <rect x="10" y="22" width="60" height="44" rx="6" stroke="#9b9282" strokeWidth="1.5" />
        <circle cx="40" cy="44" r="14" stroke="#9b9282" strokeWidth="1.5" />
        <circle cx="40" cy="44" r="8" stroke="#9b9282" strokeWidth="1.5" />
        <path d="M28 22l4-8h16l4 8" stroke="#9b9282" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="62" cy="32" r="3" fill="#9b9282" />
      </svg>

      <p style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: '24px',
        fontWeight: 400,
        color: '#322e2b',
        margin: '0 0 8px',
        lineHeight: 1.3,
      }}>
        No memories from {countryName} yet
      </p>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '14px',
        color: '#9b9282',
        margin: '0 0 28px',
        maxWidth: '280px',
        lineHeight: 1.6,
      }}>
        Start building your travel archive by uploading your first photo.
      </p>
      <button
        onClick={onUploadClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '11px 22px',
          background: '#322e2b',
          color: '#f8f5ed',
          border: 'none',
          borderRadius: '8px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          letterSpacing: '0.01em',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#4a4440')}
        onMouseLeave={e => (e.currentTarget.style.background = '#322e2b')}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M7.5 2v8M3.5 6l4-4 4 4M1.5 12h12" />
        </svg>
        Upload your first photo
      </button>
    </div>
  )
}
