export const MOVIE_API_KEY = process.env.MOVIE_API_KEY || ''

export function assertMovieApiKey() {
  if (!MOVIE_API_KEY) {
    throw new Error(
      'API key not configured. Set MOVIE_API_KEY in your environment variables.',
    )
  }
}
