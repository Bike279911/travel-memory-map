# Travel Memory Map

A personal travel memory website. Click countries on a world map, upload photos, relive the memories.

---

## Features

- Interactive world map — click any country to enter its page
- Visited countries highlighted in teal
- Upload photos (JPG, PNG, WebP, up to 10MB each) with optional title and date
- Photo grid with lightbox viewer
- Hover tooltip showing country name and photo count
- Stats counter (countries visited, total photos)
- Clean serif/sans typography — designed to feel editorial, not generic

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + inline styles |
| Map | react-simple-maps |
| Database | better-sqlite3 (SQLite) |
| File storage | Local filesystem (`public/uploads/`) |
| Language | TypeScript |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

That's it — the SQLite database and upload folders are created automatically on first run.

---

## Project Structure

```
travel-memory-map/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── globals.css             # Global styles + Tailwind
│   ├── page.tsx                # Home page (server component, reads DB)
│   ├── HomeClient.tsx          # Home page client (renders map)
│   ├── not-found.tsx           # 404 page
│   └── country/
│       └── [code]/
│           ├── page.tsx        # Country page (server component)
│           └── CountryClient.tsx # Country page client (gallery + upload)
│
├── app/api/
│   ├── countries/route.ts      # GET /api/countries
│   ├── photos/route.ts         # GET /api/photos?countryCode=XX
│   └── photos/upload/route.ts  # POST /api/photos/upload
│
├── components/
│   ├── WorldMap.tsx            # react-simple-maps world map
│   ├── PhotoUploadForm.tsx     # Upload modal with drag & drop
│   ├── PhotoGrid.tsx           # Photo grid with lightbox
│   └── EmptyState.tsx          # Empty state for country with no photos
│
├── lib/
│   ├── countries.ts            # ISO country codes + names
│   ├── db.ts                   # SQLite via better-sqlite3
│   └── upload.ts               # Upload directory helpers
│
├── public/
│   └── uploads/                # Uploaded images (auto-created, git-ignored)
│
└── data/
    └── photos.db               # SQLite database (auto-created, git-ignored)
```

---

## API Reference

### `GET /api/countries`
Returns all countries with visited status and photo count.

### `GET /api/photos?countryCode=DE`
Returns all photos for a given country code (ISO 3166-1 alpha-2), newest first.

### `POST /api/photos/upload`
Upload a photo via `multipart/form-data`.

| Field | Type | Required |
|---|---|---|
| `file` | File | ✅ |
| `countryCode` | string | ✅ |
| `title` | string | optional |
| `date` | string (YYYY-MM-DD) | optional |

---

## URL Structure

| URL | Page |
|---|---|
| `/` | World map home |
| `/country/DE` | Germany photos |
| `/country/JP` | Japan photos |
| `/country/EG` | Egypt photos |

Uses ISO 3166-1 alpha-2 codes. Case-insensitive — `/country/de` and `/country/DE` both work.

---

## Future Ideas (v1.1+)

- [ ] Delete individual photos
- [ ] Full-text search across photo titles
- [ ] City-level tags within a country
- [ ] Timeline view (chronological instead of grid)
- [ ] Login / multi-user support
- [ ] Cloud storage (Cloudflare R2 or S3) instead of local files
- [ ] AI-generated captions
- [ ] Public share link for your travel map
- [ ] Map zoom and pan controls
