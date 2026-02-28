'use client'

import Link from 'next/link'
import { BookmarkPlus } from 'lucide-react'
import { EmptyState } from '@/components/common/empty-state'
import { SectionHeading } from '@/components/common/section-heading'
import { MovieCard } from '@/components/movie/movie-card'
import { useWatchlist } from '@/context/watchlist-context'

export default function WatchlistPage() {
  const { watchlist, clearWatchlist } = useWatchlist()

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-8 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          title="My Watchlist"
          description={
            watchlist.length > 0
              ? `${watchlist.length} saved item${watchlist.length === 1 ? '' : 's'}`
              : 'Save movies and TV shows to revisit later.'
          }
        />

        {watchlist.length > 0 ? (
          <button
            type="button"
            onClick={clearWatchlist}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:bg-secondary"
          >
            Clear watchlist
          </button>
        ) : null}
      </div>

      {watchlist.length === 0 ? (
        <div className="space-y-6">
          <EmptyState
            icon={BookmarkPlus}
            title="Your watchlist is empty"
            description="Browse titles and add what you want to watch next."
          />

          <div className="flex justify-center">
            <Link
              href="/"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Explore movies
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {watchlist.map((item) => (
            <MovieCard
              key={`${item.media_type}-${item.id}`}
              id={item.id}
              title={item.title}
              posterPath={item.poster_path}
              voteAverage={item.vote_average}
              releaseDate={item.release_date ?? item.first_air_date}
              mediaType={item.media_type}
            />
          ))}
        </div>
      )}
    </div>
  )
}