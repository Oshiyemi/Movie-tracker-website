const SERVER_MOVIE_API_KEY = process.env.MOVIE_API_KEY || ''
export const PUBLIC_MOVIE_API_KEY = process.env.NEXT_PUBLIC_MOVIE_API_KEY || ''

// Prefer server-side key; optionally fall back to NEXT_PUBLIC_ key only
// for setups that intentionally expose key usage in browser code.
export const MOVIE_API_KEY = SERVER_MOVIE_API_KEY || PUBLIC_MOVIE_API_KEY

export function assertMovieApiKey() {
  if (!MOVIE_API_KEY) {
    throw new Error(
      'API key not configured. Set MOVIE_API_KEY in Netlify environment variables (recommended), or NEXT_PUBLIC_MOVIE_API_KEY only if browser exposure is intentional.',
    )
  }
}