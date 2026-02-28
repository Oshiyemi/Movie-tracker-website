import { NextResponse } from 'next/server'
import { getPopularMovies, getPopularTV } from '@/services/tmdb'

function sanitizePage(value) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

export async function GET(request) {
  const type = request.nextUrl.searchParams.get('type') === 'tv' ? 'tv' : 'movie'
  const page = sanitizePage(request.nextUrl.searchParams.get('page'))

  try {
    const payload = type === 'tv' ? await getPopularTV(page) : await getPopularMovies(page)
    return NextResponse.json(payload)
  } catch (error) {
    console.error('GET /api/popular failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch popular titles.', results: [], total_pages: 0 },
      { status: 500 },
    )
  }
}