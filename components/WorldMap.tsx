'use client'

import { useCallback, useState, useEffect } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'
import { useRouter } from 'next/navigation'
import { getCodeFromNumericId } from '@/lib/countries'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const DEFAULT_CENTER: [number, number] = [0, 0]
const DEFAULT_ZOOM = 1

function getCountryCode(geo: any): string | undefined {
  return geo.properties?.ISO_A2 || getCodeFromNumericId(geo.id)
}

interface WorldMapProps {
  visitedCodes: string[]
  photoCounts: Record<string, number>
}

export default function WorldMap({ visitedCodes, photoCounts }: WorldMapProps) {
  const router = useRouter()
  const [tooltip, setTooltip] = useState<{ name: string; code: string; x: number; y: number } | null>(null)
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const visitedSet = new Set(visitedCodes)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault()
        setCenter(DEFAULT_CENTER)
        setZoom(DEFAULT_ZOOM)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleClick = useCallback(
    (geo: any) => {
      const code = getCountryCode(geo)
      if (code && code !== '-99') {
        router.push(`/country/${code}`)
      }
    },
    [router]
  )

  const handleMouseEnter = useCallback((geo: any, evt: React.MouseEvent) => {
    const name = geo.properties?.NAME || geo.properties?.name || 'Unknown'
    const code = getCountryCode(geo) || ''
    setTooltip({ name, code, x: evt.clientX, y: evt.clientY })
  }, [])

  const handleMouseMove = useCallback((evt: React.MouseEvent) => {
    setTooltip(prev => prev ? { ...prev, x: evt.clientX, y: evt.clientY } : null)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTooltip(null)
  }, [])

  return (
    <div className="relative w-full world-map-wrapper" onMouseMove={handleMouseMove}>
      <ComposableMap
        projectionConfig={{
          scale: 145,
          center: [10, 10],
        }}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup
          center={center}
          zoom={zoom}
          minZoom={1}
          maxZoom={6}
          onMoveEnd={({ coordinates, zoom: z }) => {
            setCenter(coordinates)
            setZoom(z)
          }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const code = getCountryCode(geo)
                const isVisited = code && visitedSet.has(code)
                const count = code ? photoCounts[code] ?? 0 : 0

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseDown={(evt) => evt.stopPropagation()}
                    onClick={(evt) => {
                      evt.stopPropagation()
                      handleClick(geo)
                    }}
                    onMouseEnter={(evt) => handleMouseEnter(geo, evt as any)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: {
                        fill: isVisited ? '#4b8fa8' : '#d4cfc3',
                        stroke: '#f8f5ed',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: isVisited ? '#3a7a94' : '#b8b1a1',
                        stroke: '#f8f5ed',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: '#2d6478',
                        stroke: '#f8f5ed',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-2 rounded-lg text-sm"
          style={{
            left: tooltip.x + 14,
            top: tooltip.y - 36,
            background: '#322e2b',
            color: '#f8f5ed',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontWeight: 500 }}>{tooltip.name}</span>
          {visitedSet.has(tooltip.code) && photoCounts[tooltip.code] && (
            <span style={{ marginLeft: 8, opacity: 0.65, fontSize: '11px' }}>
              {photoCounts[tooltip.code]} photo{photoCounts[tooltip.code] !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
