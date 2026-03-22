import { NextRequest, NextResponse } from 'next/server'
import { deletePhoto } from '@/lib/db'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id
  if (!id) {
    return NextResponse.json({ error: 'Photo ID required' }, { status: 400 })
  }

  try {
    // Delete from DB (file cleanup is best-effort; DB is source of truth)
    deletePhoto(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
