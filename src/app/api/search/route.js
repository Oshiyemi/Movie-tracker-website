import { NextResponse } from 'next/server'
import { searchMulti } from '@/services/tmdb'

function sanitizePage(value) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

export async function GET(request) {
  const query = request.nextUrl.searchParams.get('q')?.trim() || ''
  const page = sanitizePage(request.nextUrl.searchParams.get('page'))

  if (!query) {
    return NextResponse.json({ results: [], total_pages: 0, total_results: 0, page: 1 })
  }

  try {
    const payload = await searchMulti(query, page)
    return NextResponse.json(payload)
  } catch (error) {
    console.error('GET /api/search failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch search results.', results: [], total_pages: 0, total_results: 0, page: 1 },
      { status: 500 },
    )
  }
}