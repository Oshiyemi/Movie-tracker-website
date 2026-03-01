import { NextResponse } from 'next/server'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

function sanitizePage(value) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

function sanitizeGenre(value) {
  const genre = Number(value)
  return Number.isInteger(genre) && genre > 0 ? genre : 0
}

export async function GET(request) {
  const apiKey = process.env.MOVIE_API_KEY || ''

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Server movie API key is not configured.', results: [], total_pages: 0, total_results: 0, page: 1 },
      { status: 500 },
    )
  }

  const page = sanitizePage(request.nextUrl.searchParams.get('page'))
  const genre = sanitizeGenre(request.nextUrl.searchParams.get('genre'))
  const path = genre > 0 ? '/discover/movie' : '/movie/popular'

  const url = new URL(`${TMDB_BASE_URL}${path}`)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('page', String(page))

  if (genre > 0) {
    url.searchParams.set('with_genres', String(genre))
    url.searchParams.set('sort_by', 'popularity.desc')
  }

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 900 },
    })

    if (!response.ok) {
      const payload = await response.text().catch(() => '')
      console.error('GET /api/movies failed:', response.status, payload)
      return NextResponse.json(
        { error: 'Failed to fetch movies.', results: [], total_pages: 0, total_results: 0, page },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('GET /api/movies failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movies.', results: [], total_pages: 0, total_results: 0, page },
      { status: 500 },
    )
  }
}
