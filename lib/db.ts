import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = path.join(process.cwd(), 'data', 'photos.db')

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

let db: Database.Database

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    initSchema(db)
  }
  return db
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      country_code TEXT NOT NULL,
      url TEXT NOT NULL,
      title TEXT,
      date TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_photos_country ON photos(country_code);
  `)
}

export interface Photo {
  id: string
  countryCode: string
  url: string
  title: string | null
  date: string | null
  createdAt: string
}

export function getPhotosByCountry(countryCode: string): Photo[] {
  const db = getDb()
  const rows = db.prepare(`
    SELECT id, country_code, url, title, date, created_at
    FROM photos
    WHERE country_code = ?
    ORDER BY created_at DESC
  `).all(countryCode) as any[]

  return rows.map(row => ({
    id: row.id,
    countryCode: row.country_code,
    url: row.url,
    title: row.title,
    date: row.date,
    createdAt: row.created_at,
  }))
}

export function insertPhoto(photo: Omit<Photo, 'createdAt'>): Photo {
  const db = getDb()
  const now = new Date().toISOString()
  db.prepare(`
    INSERT INTO photos (id, country_code, url, title, date, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(photo.id, photo.countryCode, photo.url, photo.title, photo.date, now)

  return { ...photo, createdAt: now }
}

export function deletePhoto(id: string): void {
  const db = getDb()
  db.prepare('DELETE FROM photos WHERE id = ?').run(id)
}

export function getCountriesWithPhotos(): string[] {
  const db = getDb()
  const rows = db.prepare(`
    SELECT DISTINCT country_code FROM photos ORDER BY country_code
  `).all() as any[]
  return rows.map(r => r.country_code)
}

export function getPhotoCountByCountry(): Record<string, number> {
  const db = getDb()
  const rows = db.prepare(`
    SELECT country_code, COUNT(*) as count FROM photos GROUP BY country_code
  `).all() as any[]
  const result: Record<string, number> = {}
  rows.forEach(r => { result[r.country_code] = r.count })
  return result
}
