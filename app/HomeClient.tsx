'use client'

import dynamic from 'next/dynamic'

const WorldMap = dynamic(() => import('@/components/WorldMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      aspectRatio: '2/1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9b9282',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '14px',
    }}>
      Loading map…
    </div>
  ),
})

interface HomeClientProps {
  visitedCodes: string[]
  photoCounts: Record<string, number>
}

export default function HomeClient({ visitedCodes, photoCounts }: HomeClientProps) {
  const totalPhotos = Object.values(photoCounts).reduce((a, b) => a + b, 0)
  const totalCountries = visitedCodes.length

  return (
    <main style={{ minHeight: '100vh', background: '#f8f5ed' }}>
      {/* Header */}
      <header style={{
        padding: '28px 48px 20px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e4d8c1',
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '28px',
            fontWeight: 300,
            color: '#1c1a18',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            Travel Memory Map
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            color: '#9b9282',
            margin: '4px 0 0',
          }}>
            Your world. Your stories.
          </p>
        </div>

        {/* Stats */}
        {totalCountries > 0 && (
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-end' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '32px',
                fontWeight: 400,
                color: '#322e2b',
                lineHeight: 1,
              }}>
                {totalCountries}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px',
                color: '#9b9282',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}>
                {totalCountries === 1 ? 'Country' : 'Countries'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '32px',
                fontWeight: 400,
                color: '#322e2b',
                lineHeight: 1,
              }}>
                {totalPhotos}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px',
                color: '#9b9282',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginTop: '2px',
              }}>
                {totalPhotos === 1 ? 'Photo' : 'Photos'}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Map area */}
      <div style={{ padding: '8px 0 0', position: 'relative' }}>
        <WorldMap visitedCodes={visitedCodes} photoCounts={photoCounts} />

        {/* Legend - fixed to viewport, does not move with map zoom/pan */}
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '48px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#4b8fa8' }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              color: '#7e7568',
            }}>
              Visited
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#d4cfc3' }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              color: '#7e7568',
            }}>
              Not yet
            </span>
          </div>
        </div>

        {/* Hint */}
        {totalCountries === 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '18px',
              fontStyle: 'italic',
              color: '#9b9282',
              margin: 0,
            }}>
              Click any country to begin
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
