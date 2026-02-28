import { NextResponse } from 'next/server'
import { discoverMoviesByGenre } from '@/services/tmdb'

function sanitizePage(value) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

export async function GET(request) {
  const genre = Number(request.nextUrl.searchParams.get('genre'))
  const page = sanitizePage(request.nextUrl.searchParams.get('page'))

  if (!Number.isInteger(genre) || genre <= 0) {
    return NextResponse.json({ results: [], total_pages: 0, total_results: 0, page: 1 })
  }

  try {
    const payload = await discoverMoviesByGenre(genre, page)
    return NextResponse.json(payload)
  } catch (error) {
    console.error('GET /api/discover failed:', error)
    return NextResponse.json(
      { error: 'Failed to discover movies.', results: [], total_pages: 0, total_results: 0, page: 1 },
      { status: 500 },
    )
  }
}