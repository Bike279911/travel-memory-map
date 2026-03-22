import { NextRequest, NextResponse } from 'next/server'
import { getPhotosByCountry } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const countryCode = searchParams.get('countryCode')

  if (!countryCode) {
    return NextResponse.json({ error: 'countryCode is required' }, { status: 400 })
  }

  try {
    const photos = getPhotosByCountry(countryCode.toUpperCase())
    return NextResponse.json(photos)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
  }
}
