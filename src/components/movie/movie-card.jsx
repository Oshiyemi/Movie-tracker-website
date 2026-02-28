'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, Plus, Star, Tv, Video } from 'lucide-react'
import { useWatchlist } from '@/context/watchlist-context'
import { imageUrl } from '@/utils/tmdb-image'

export function MovieCard({
  id,
  title,
  posterPath,
  voteAverage,
  releaseDate,
  mediaType,
}) {
  const { addToWatchlist, isInWatchlist, removeFromWatchlist } = useWatchlist()

  const isSaved = isInWatchlist(id, mediaType)

  function toggleWatchlist(event) {
    event.preventDefault()
    event.stopPropagation()

    if (isSaved) {
      removeFromWatchlist(id, mediaType)
      return
    }

    addToWatchlist({
      id,
      title,
      poster_path: posterPath,
      vote_average: voteAverage,
      media_type: mediaType,
      release_date: mediaType === 'movie' ? releaseDate : undefined,
      first_air_date: mediaType === 'tv' ? releaseDate : undefined,
    })
  }

  return (
    <Link
      href={`/${mediaType}/${id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-secondary">
        {posterPath ? (
          <Image
            src={imageUrl(posterPath, 'w500')}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            {mediaType === 'tv' ? <Tv className="h-10 w-10" /> : <Video className="h-10 w-10" />}
          </div>
        )}

        <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-xs font-semibold backdrop-blur">
          <Star className="h-3 w-3 fill-primary text-primary" />
          {Number(voteAverage || 0).toFixed(1)}
        </div>

        <button
          type="button"
          onClick={toggleWatchlist}
          aria-label={isSaved ? 'Remove from watchlist' : 'Add to watchlist'}
          className={`absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full transition ${
            isSaved
              ? 'bg-primary text-primary-foreground'
              : 'bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground'
          }`}
        >
          {isSaved ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-balance">{title}</h3>
        {releaseDate ? (
          <p className="text-xs text-muted-foreground">{new Date(releaseDate).getFullYear()}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Release date unavailable</p>
        )}
      </div>
    </Link>
  )
}