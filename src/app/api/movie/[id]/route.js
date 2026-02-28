import { NextResponse } from 'next/server'
import { getMovieDetails } from '@/services/tmdb'

export async function GET(_request, { params }) {
  const resolvedParams = await params
  const id = Number(resolvedParams?.id)

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid movie id.' }, { status: 400 })
  }

  try {
    const payload = await getMovieDetails(id)
    return NextResponse.json(payload)
  } catch (error) {
    console.error(`GET /api/movie/${id} failed:`, error)
    return NextResponse.json({ error: 'Movie not found.' }, { status: 404 })
  }
}
