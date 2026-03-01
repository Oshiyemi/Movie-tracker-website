'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search as SearchIcon, Sparkles } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { LoadingGrid } from '@/components/common/loading-grid'
import { SectionHeading } from '@/components/common/section-heading'
import { MovieCard } from '@/components/movie/movie-card'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { fetchJson } from '@/services/api-client'

function getErrorMessage(error, fallback) {
  if (error && typeof error === 'object' && typeof error.message === 'string' && error.message.trim()) {
    return error.message
  }

  return fallback
}

function mergeUniqueResults(items) {
  const seen = new Set()

  return items.filter((item) => {
    const mediaType = item.media_type === 'tv' ? 'tv' : item.media_type === 'movie' ? 'movie' : 'other'
    const key = `${mediaType}:${item.id}`

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

export function SearchPageContent() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const initialQuery = useMemo(() => searchParams.get('q')?.trim() || '', [searchParams])

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [retryToken, setRetryToken] = useState(0)

  const debouncedQuery = useDebouncedValue(query.trim(), 450)
  const previousDebouncedRef = useRef(debouncedQuery)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.get('q')?.trim() || ''

    if (current === debouncedQuery) {
      return
    }

    if (debouncedQuery) {
      params.set('q', debouncedQuery)
    } else {
      params.delete('q')
    }

    const next = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(next, { scroll: false })
  }, [debouncedQuery, pathname, router, searchParams])

  useEffect(() => {
    const queryChanged = previousDebouncedRef.current !== debouncedQuery

    if (queryChanged) {
      previousDebouncedRef.current = debouncedQuery
      setError('')

      if (page !== 1) {
        setPage(1)
        return
      }
    }

    if (!debouncedQuery) {
      setResults([])
      setTotalPages(0)
      setIsLoading(false)
      setIsLoadingMore(false)
      setError('')
      return
    }

    const controller = new AbortController()
    const firstPage = page === 1

    async function loadResults() {
      if (firstPage) {
        setIsLoading(true)
        setError('')
      } else {
        setIsLoadingMore(true)
      }

      try {
        const data = await fetchJson(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}&page=${page}`,
          { signal: controller.signal },
          { dedupe: false },
        )

        const filtered = (Array.isArray(data.results) ? data.results : []).filter(
          (item) => item.media_type === 'movie' || item.media_type === 'tv',
        )

        if (firstPage) {
          setResults(filtered)
        } else {
          setResults((previous) => mergeUniqueResults([...previous, ...filtered]))
        }

        setTotalPages(typeof data.total_pages === 'number' ? data.total_pages : 0)
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return
        }

        if (firstPage) {
          setResults([])
        }

        setError(getErrorMessage(fetchError, 'Unable to load search results right now.'))
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
          setIsLoadingMore(false)
        }
      }
    }

    loadResults()

    return () => controller.abort()
  }, [debouncedQuery, page, retryToken])

  const hasQuery = debouncedQuery.length > 0

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-8 lg:px-8">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Search Movies & TV Shows
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Search is debounced to reduce duplicate requests while keeping results fast.
        </p>
      </header>

      <form className="mb-8" onSubmit={(event) => event.preventDefault()}>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by movie or TV title"
            className="h-14 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-base shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </form>

      {isLoading ? (
        <LoadingGrid count={10} />
      ) : error ? (
        <ErrorState
          message={error}
          hint="Check MOVIE_API_KEY and try again."
          onRetry={() => setRetryToken((value) => value + 1)}
        />
      ) : hasQuery && results.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="No matches found"
          description={`We couldn't find anything for "${debouncedQuery}".`}
        />
      ) : results.length > 0 ? (
        <>
          <SectionHeading
            title={`Results for "${debouncedQuery}"`}
            description={`Showing ${results.length} result${results.length === 1 ? '' : 's'}`}
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {results.map((item) => (
              <MovieCard
                key={`${item.id}-${item.media_type}`}
                id={item.id}
                title={item.title ?? item.name ?? 'Untitled'}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                releaseDate={item.release_date ?? item.first_air_date}
                mediaType={item.media_type === 'tv' ? 'tv' : 'movie'}
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
      ) : (
        <EmptyState
          icon={Sparkles}
          title="Start your search"
          description="Type in the search field above to find movies and TV shows."
        />
      )}
    </div>
  )
}
