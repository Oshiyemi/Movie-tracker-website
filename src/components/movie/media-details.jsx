'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Check, Clock3, Plus, Star, Tv, Video } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { useWatchlist } from '@/context/watchlist-context'
import { fetchJson } from '@/services/api-client'
import { imageUrl } from '@/utils/tmdb-image'

function formatCurrency(value) {
  if (!value || value <= 0) {
    return 'N/A'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatRuntime(item, mediaType) {
  if (mediaType === 'movie') {
    return item.runtime ? `${item.runtime} min` : 'N/A'
  }

  if (Array.isArray(item.episode_run_time) && item.episode_run_time.length > 0) {
    return `${item.episode_run_time[0]} min`
  }

  return 'N/A'
}

function readErrorMessage(error) {
  if (error && typeof error === 'object' && typeof error.message === 'string' && error.message.trim()) {
    return error.message
  }

  return 'Unable to load title details right now.'
}

export function MediaDetails({ mediaType, mediaId }) {
  const router = useRouter()
  const [details, setDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryToken, setRetryToken] = useState(0)

  const parsedId = useMemo(() => Number(mediaId), [mediaId])

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()

  const isSaved = details ? isInWatchlist(details.id, mediaType) : false

  useEffect(() => {
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      setDetails(null)
      setError('Invalid title id.')
      setIsLoading(false)
      return
    }

    const controller = new AbortController()

    async function loadDetails() {
      setIsLoading(true)
      setError('')

      try {
        const payload = await fetchJson(`/api/${mediaType}/${parsedId}`, { signal: controller.signal }, { dedupe: false })
        setDetails(payload)
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return
        }

        setDetails(null)
        setError(readErrorMessage(fetchError))
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadDetails()

    return () => controller.abort()
  }, [mediaType, parsedId, retryToken])

  function toggleWatchlist() {
    if (!details) {
      return
    }

    if (isSaved) {
      removeFromWatchlist(details.id, mediaType)
      return
    }

    addToWatchlist({
      id: details.id,
      title: details.title ?? details.name,
      poster_path: details.poster_path,
      vote_average: details.vote_average,
      media_type: mediaType,
      release_date: details.release_date,
      first_air_date: details.first_air_date,
    })
  }

  function handleBackNavigation() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }

    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <div className="h-[48vh] min-h-[320px] animate-pulse rounded-3xl bg-card" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 lg:px-8">
        <ErrorState message={error} onRetry={() => setRetryToken((value) => value + 1)} />
      </div>
    )
  }

  if (!details) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 lg:px-8">
        <EmptyState
          icon={mediaType === 'tv' ? Tv : Video}
          title="Title not found"
          description="The requested title could not be loaded."
        />
      </div>
    )
  }

  const title = details.title ?? details.name ?? 'Untitled'
  const poster = imageUrl(details.poster_path, 'w500')
  const backdrop = imageUrl(details.backdrop_path, 'original')
  const year = details.release_date || details.first_air_date
  const metaBadges = [
    year ? new Date(year).getFullYear().toString() : null,
    formatRuntime(details, mediaType),
    mediaType === 'tv' && details.number_of_seasons ? `${details.number_of_seasons} seasons` : null,
    mediaType === 'movie' && details.status ? details.status : null,
  ].filter(Boolean)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
      <section className="relative mb-8 min-h-[320px] overflow-hidden rounded-3xl border border-border bg-card">
        {backdrop ? (
          <Image src={backdrop} alt={title} fill className="object-cover" priority />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />

        <div className="absolute left-4 top-4 z-10">
          <button
            type="button"
            onClick={handleBackNavigation}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/80 px-3 py-2 text-sm font-semibold backdrop-blur transition hover:bg-background"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="absolute right-4 top-4 z-10">
          <Link
            href="/"
            className="inline-flex rounded-lg border border-border bg-background/80 px-3 py-2 text-xs font-medium text-muted-foreground backdrop-blur transition hover:text-foreground"
          >
            Home
          </Link>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
          <h1 className="font-heading text-3xl font-semibold leading-tight text-balance sm:text-4xl">{title}</h1>
          {details.tagline ? <p className="mt-2 text-sm italic text-primary">{details.tagline}</p> : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {metaBadges.map((badge) => (
              <span key={badge} className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium backdrop-blur">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 pb-8 md:grid-cols-[260px,1fr]">
        <aside>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {poster ? (
              <Image src={poster} alt={title} width={520} height={780} className="h-auto w-full object-cover" />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center bg-secondary text-muted-foreground">
                {mediaType === 'tv' ? <Tv className="h-10 w-10" /> : <Video className="h-10 w-10" />}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleWatchlist}
            className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              isSaved
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border border-border bg-card hover:bg-secondary'
            }`}
          >
            {isSaved ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isSaved ? 'Saved in watchlist' : 'Add to watchlist'}
          </button>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <strong className="font-semibold text-foreground">{Number(details.vote_average || 0).toFixed(1)}</strong>
              ({Number(details.vote_count || 0).toLocaleString()} votes)
            </span>

            {year ? (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(year).toLocaleDateString()}
              </span>
            ) : null}

            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" />
              {formatRuntime(details, mediaType)}
            </span>
          </div>

          {details.genres?.length ? (
            <div className="mb-6 flex flex-wrap gap-2">
              {details.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          ) : null}

          <article className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-2 text-lg font-semibold">Overview</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {details.overview || 'No overview available for this title.'}
            </p>
          </article>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoTile label="Status" value={details.status || 'N/A'} />
            {mediaType === 'movie' ? (
              <>
                <InfoTile label="Budget" value={formatCurrency(details.budget)} />
                <InfoTile label="Revenue" value={formatCurrency(details.revenue)} />
              </>
            ) : (
              <>
                <InfoTile label="Seasons" value={String(details.number_of_seasons || 'N/A')} />
                <InfoTile label="Episodes" value={String(details.number_of_episodes || 'N/A')} />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}
