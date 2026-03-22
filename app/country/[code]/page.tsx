import { getPhotosByCountry } from '@/lib/db'
import { getCountryByCode } from '@/lib/countries'
import { notFound } from 'next/navigation'
import CountryClient from './CountryClient'

export const dynamic = 'force-dynamic'

interface Props {
  params: { code: string }
}

export default async function CountryPage({ params }: Props) {
  const code = params.code.toUpperCase()
  const country = getCountryByCode(code)

  if (!country) {
    notFound()
  }

  let photos = []
  try {
    photos = getPhotosByCountry(code) as any[]
  } catch (err) {
    console.error(err)
  }

  return <CountryClient country={country} initialPhotos={photos} />
}

export async function generateMetadata({ params }: Props) {
  const country = getCountryByCode(params.code.toUpperCase())
  return {
    title: country ? `${country.name} — Travel Memory Map` : 'Country',
  }
}
