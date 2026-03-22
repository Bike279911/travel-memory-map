import { NextResponse } from 'next/server'
import { COUNTRIES } from '@/lib/countries'
import { getCountriesWithPhotos, getPhotoCountByCountry } from '@/lib/db'

export async function GET() {
  try {
    const visitedCodes = getCountriesWithPhotos()
    const photoCounts = getPhotoCountByCountry()

    const countries = COUNTRIES.map(c => ({
      ...c,
      visited: visitedCodes.includes(c.code),
      photoCount: photoCounts[c.code] ?? 0,
    }))

    return NextResponse.json(countries)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch countries' }, { status: 500 })
  }
}
