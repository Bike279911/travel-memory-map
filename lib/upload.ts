import path from 'path'
import fs from 'fs'

export function getUploadDir(countryCode: string): string {
  const dir = path.join(process.cwd(), 'public', 'uploads', countryCode.toLowerCase())
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

export function getPhotoUrl(countryCode: string, filename: string): string {
  return `/uploads/${countryCode.toLowerCase()}/${filename}`
}

export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
