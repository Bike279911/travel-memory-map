import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { insertPhoto } from '@/lib/db'
import { getUploadDir, getPhotoUrl, ALLOWED_TYPES, MAX_FILE_SIZE } from '@/lib/upload'
import { getCountryByCode } from '@/lib/countries'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const file = formData.get('file') as File | null
    const countryCode = formData.get('countryCode') as string | null
    const title = formData.get('title') as string | null
    const date = formData.get('date') as string | null

    // Validate
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }
    if (!countryCode) {
      return NextResponse.json({ error: 'countryCode is required' }, { status: 400 })
    }
    if (!getCountryByCode(countryCode)) {
      return NextResponse.json({ error: 'Invalid country code' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'File type not supported. Use JPG, PNG, or WebP.' }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 })
    }

    // Save file
    const ext = file.name.split('.').pop() || 'jpg'
    const id = uuidv4()
    const filename = `${id}.${ext}`
    const uploadDir = getUploadDir(countryCode)
    const filePath = path.join(uploadDir, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const url = getPhotoUrl(countryCode, filename)

    const photo = insertPhoto({
      id,
      countryCode: countryCode.toUpperCase(),
      url,
      title: title || null,
      date: date || null,
    })

    return NextResponse.json({ success: true, photo })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
