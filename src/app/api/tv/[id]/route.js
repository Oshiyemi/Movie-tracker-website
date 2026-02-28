import { NextResponse } from 'next/server'
import { getTVDetails } from '@/services/tmdb'

export async function GET(_request, { params }) {
  const resolvedParams = await params
  const id = Number(resolvedParams?.id)

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid TV id.' }, { status: 400 })
  }

  try {
    const payload = await getTVDetails(id)
    return NextResponse.json(payload)
  } catch (error) {
    console.error(`GET /api/tv/${id} failed:`, error)
    return NextResponse.json({ error: 'TV show not found.' }, { status: 404 })
  }
}
