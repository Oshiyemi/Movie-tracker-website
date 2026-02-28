'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Flame, Play, TrendingUp } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { LoadingGrid } from '@/components/common/loading-grid'
import { SectionHeading } from '@/components/common/section-heading'
import { MovieCard } from '@/components/movie/movie-card'
import { fetchJson } from '@/services/api-client'
import { imageUrl } from '@/utils/tmdb-image'

function getErrorMessage(error, fallback) {
  if (error && typeof error === 'object' && typeof error.message === 'string' && error.message.trim()) {
    return error.message
  }

  return fallback
}

function mergeUniqueMedia(items) {
  const seen = new Set()

  return items.filter((item) => {
    const mediaType = item.media_type === 'tv' ? 'tv' : 'movie'
    const key = `${mediaType}:${item.id}`

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

export default function HomePage() {
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [genres, setGenres] = useState([])

  const [selectedGenre, setSelectedGenre] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [isTrendingLoading, setIsTrendingLoading] = useState(true)
  const [isPopularLoading, setIsPopularLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const [trendingError, setTrendingError] = useState('')
  const [popularError, setPopularError] = useState('')
  const [genreError, setGenreError] = useState('')

  const [trendingRetryToken, setTrendingRetryToken] = useState(0)
  const [popularRetryToken, setPopularRetryToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadTrending() {
      setIsTrendingLoading(true)
      setTrendingError('')

      try {
        const data = await fetchJson('/api/trending', { signal: controller.signal }, { dedupe: false })
        setTrending(Array.isArray(data.results) ? data.results : [])
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setTrending([])
        setTrendingError(getErrorMessage(error, 'Unable to load trending titles right now.'))
      } finally {
        if (!controller.signal.aborted) {
          setIsTrendingLoading(false)
        }
      }
    }

    loadTrending()

    return () => controller.abort()
  }, [trendingRetryToken])

  useEffect(() => {
    const controller = new AbortController()

    async function loadGenres() {
      setGenreError('')

      try {
        const data = await fetchJson('/api/genres', { signal: controller.signal })
        setGenres(Array.isArray(data.genres) ? data.genres : [])
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setGenres([])
        setGenreError(getErrorMessage(error, 'Genre filters are unavailable right now.'))
      }
    }

    loadGenres()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const firstPage = page === 1

    async function loadPopular() {
      if (firstPage) {
        setIsPopularLoading(true)
        setPopularError('')
      } else {
        setIsLoadingMore(true)
      }

      try {
        const endpoint =
          selectedGenre === 'all'
            ? `/api/popular?type=movie&page=${page}`
            : `/api/discover?genre=${selectedGenre}&page=${page}`

        const data = await fetchJson(endpoint, { signal: controller.signal }, { dedupe: false })
        const items = Array.isArray(data.results) ? data.results : []

        if (firstPage) {
          setPopular(items)
        } else {
          setPopular((previous) => mergeUniqueMedia([...previous, ...items]))
        }

        setTotalPages(typeof data.total_pages === 'number' ? data.total_pages : 1)
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        if (firstPage) {
          setPopular([])
        }

        setPopularError(getErrorMessage(error, 'Unable to load movies right now.'))
      } finally {
        if (!controller.signal.aborted) {
          setIsPopularLoading(false)
          setIsLoadingMore(false)
        }
      }
    }

    loadPopular()

    return () => controller.abort()
  }, [selectedGenre, page, popularRetryToken])

  function handleGenreChange(genreId) {
    setSelectedGenre(genreId)
    setPage(1)
  }

  const featured = useMemo(() => trending[0], [trending])
  const trendingStrip = useMemo(() => trending.slice(1, 9), [trending])

  return (
    <div className="min-h-screen">
      {isTrendingLoading ? (
        <section className="relative h-[60vh] min-h-[360px] overflow-hidden bg-card">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-card via-card/70 to-secondary" />
        </section>
      ) : featured ? (
        <section className="relative h-[60vh] min-h-[360px] overflow-hidden">
          {featured.backdrop_path ? (
            <Image
              src={imageUrl(featured.backdrop_path, 'original')}
              alt={featured.title ?? featured.name ?? 'Featured title'}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-card via-card/80 to-secondary" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />

          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-4 pb-12 lg:px-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/50 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
                <TrendingUp className="h-3.5 w-3.5" />
                Trending Today
              </div>

              <h1 className="max-w-2xl font-heading text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                {featured.title ?? featured.name ?? 'Featured title'}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                {featured.overview || 'No overview available for this title yet.'}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`/${featured.media_type === 'tv' ? 'tv' : 'movie'}/${featured.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  <Play className="h-4 w-4 fill-current" />
                  View Details
                </Link>

                <span className="rounded-lg border border-border/70 bg-background/65 px-3 py-2 text-xs font-medium text-muted-foreground backdrop-blur">
                  Rating {Number(featured.vote_average || 0).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 pt-10 lg:px-8">
          <EmptyState
            icon={Flame}
            title="No featured title right now"
            description="Try refreshing in a moment to load trending picks."
          />
        </section>
      )}

      {trendingError ? (
        <div className="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
          <ErrorState
            message={trendingError}
            hint="Check MOVIE_API_KEY or NEXT_PUBLIC_MOVIE_API_KEY in your Netlify environment variables if this keeps happening."
            onRetry={() => setTrendingRetryToken((value) => value + 1)}
          />
        </div>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 pt-10 lg:px-8">
        <SectionHeading
          title="Trending now"
          description="Fresh picks people are watching this week."
          action={
            <Link href="/search" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
              Browse all
              <ChevronRight className="h-4 w-4" />
            </Link>
          }
        />

        {isTrendingLoading ? (
          <LoadingGrid count={6} compact />
        ) : trendingStrip.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {trendingStrip.map((item) => (
              <MovieCard
                key={`${item.id}-${item.media_type || 'movie'}`}
                id={item.id}
                title={item.title ?? item.name ?? 'Untitled'}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                releaseDate={item.release_date ?? item.first_air_date}
                mediaType={item.media_type === 'tv' ? 'tv' : 'movie'}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={TrendingUp}
            title="No trending titles"
            description="TMDB returned an empty feed. Please try again shortly."
          />
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-12 lg:px-8">
        <SectionHeading
          title="Popular movies"
          description="Browse top movies and filter by genre."
        />

        {genreError ? <p className="mb-4 text-xs text-muted-foreground">{genreError}</p> : null}

        {genres.length > 0 ? (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleGenreChange('all')}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                selectedGenre === 'all'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>

            {genres.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() => handleGenreChange(String(genre.id))}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                  selectedGenre === String(genre.id)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        ) : null}

        {isPopularLoading ? (
          <LoadingGrid count={10} />
        ) : popularError ? (
          <ErrorState
            message={popularError}
            onRetry={() => setPopularRetryToken((value) => value + 1)}
          />
        ) : popular.length === 0 ? (
          <EmptyState
            icon={Play}
            title="No movies found"
            description="Try selecting another genre filter."
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {popular.map((item) => (
                <MovieCard
                  key={`${item.id}-movie`}
                  id={item.id}
                  title={item.title ?? item.name ?? 'Untitled'}
                  posterPath={item.poster_path}
                  voteAverage={item.vote_average}
                  releaseDate={item.release_date ?? item.first_air_date}
                  mediaType="movie"
                />
              ))}
            </div>

            {page < totalPages ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setPage((value) => value + 1)}
                  disabled={isLoadingMore}
                  className="inline-flex min-w-36 items-center justify-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoadingMore ? 'Loading...' : 'Load more'}
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  )
}