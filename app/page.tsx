import { getPhotoCountByCountry, getCountriesWithPhotos } from '@/lib/db'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let visitedCodes: string[] = []
  let photoCounts: Record<string, number> = {}

  try {
    visitedCodes = getCountriesWithPhotos()
    photoCounts = getPhotoCountByCountry()
  } catch (err) {
    console.error('DB error on home page:', err)
  }

  return (
    <HomeClient
      visitedCodes={visitedCodes}
      photoCounts={photoCounts}
    />
  )
}
