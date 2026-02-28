import { NextResponse } from 'next/server'
import { getMovieGenres } from '@/services/tmdb'

export async function GET() {
  try {
    const payload = await getMovieGenres()
    return NextResponse.json(payload)
  } catch (error) {
    console.error('GET /api/genres failed:', error)
    return NextResponse.json({ error: 'Failed to fetch genres.', genres: [] }, { status: 500 })
  }
}