export const MOVIE_API_KEY = process.env.MOVIE_API_KEY || ''

export function assertMovieApiKey() {
  if (!MOVIE_API_KEY) {
    throw new Error('MOVIE_API_KEY is not configured. Add it to .env.local.')
  }
}