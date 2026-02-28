import 'server-only'
import { assertMovieApiKey, MOVIE_API_KEY } from '@/services/config'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

function withPage(value) {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return '1'
  }

  return String(parsed)
}

async function tmdbRequest(path, options = {}) {
  assertMovieApiKey()

  const { query = {}, revalidate = 1800 } = options

  const url = new URL(`${TMDB_BASE_URL}${path}`)
  url.searchParams.set('api_key', MOVIE_API_KEY)

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      url.searchParams.set(key, String(value))
    }
  }

  const response = await fetch(url.toString(), {
    next: { revalidate },
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    console.error(`[TMDB] ${path} failed with ${response.status}: ${body}`)
    throw new Error(`TMDB request failed (${response.status})`)
  }

  return response.json()
}

export function getTrending() {
  return tmdbRequest('/trending/all/day', { revalidate: 900 })
}

export function getPopularMovies(page = 1) {
  return tmdbRequest('/movie/popular', {
    query: { page: withPage(page) },
    revalidate: 900,
  })
}

export function getPopularTV(page = 1) {
  return tmdbRequest('/tv/popular', {
    query: { page: withPage(page) },
    revalidate: 900,
  })
}

export function searchMulti(query, page = 1) {
  return tmdbRequest('/search/multi', {
    query: { query, page: withPage(page) },
    revalidate: 60,
  })
}

export function getMovieDetails(id) {
  return tmdbRequest(`/movie/${id}`, {
    query: { append_to_response: 'credits,videos,similar' },
    revalidate: 1800,
  })
}

export function getTVDetails(id) {
  return tmdbRequest(`/tv/${id}`, {
    query: { append_to_response: 'credits,videos,similar' },
    revalidate: 1800,
  })
}

export function getMovieGenres() {
  return tmdbRequest('/genre/movie/list', { revalidate: 86400 })
}

export function discoverMoviesByGenre(genreId, page = 1) {
  return tmdbRequest('/discover/movie', {
    query: {
      with_genres: String(genreId),
      page: withPage(page),
      sort_by: 'popularity.desc',
    },
    revalidate: 900,
  })
}