'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'movie-tracker-watchlist'

const WatchlistContext = createContext(undefined)

function normalizeItem(item) {
  return {
    id: Number(item.id),
    title: item.title || 'Untitled',
    poster_path: item.poster_path || null,
    vote_average: Number(item.vote_average || 0),
    media_type: item.media_type === 'tv' ? 'tv' : 'movie',
    release_date: item.release_date || undefined,
    first_air_date: item.first_air_date || undefined,
  }
}

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(STORAGE_KEY)
      if (rawValue) {
        const parsed = JSON.parse(rawValue)
        if (Array.isArray(parsed)) {
          setWatchlist(parsed.map(normalizeItem))
        }
      }
    } catch (error) {
      console.warn('Failed to read watchlist from local storage.', error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist))
  }, [isHydrated, watchlist])

  const value = useMemo(
    () => ({
      watchlist,
      isHydrated,
      addToWatchlist(item) {
        const normalized = normalizeItem(item)

        setWatchlist((previous) => {
          const exists = previous.some(
            (entry) => entry.id === normalized.id && entry.media_type === normalized.media_type,
          )

          if (exists) {
            return previous
          }

          return [normalized, ...previous]
        })
      },
      removeFromWatchlist(id, mediaType) {
        setWatchlist((previous) =>
          previous.filter(
            (entry) => !(entry.id === Number(id) && entry.media_type === mediaType),
          ),
        )
      },
      clearWatchlist() {
        setWatchlist([])
      },
      isInWatchlist(id, mediaType) {
        return watchlist.some(
          (entry) => entry.id === Number(id) && entry.media_type === mediaType,
        )
      },
    }),
    [isHydrated, watchlist],
  )

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>
}

export function useWatchlist() {
  const context = useContext(WatchlistContext)

  if (!context) {
    throw new Error('useWatchlist must be used inside WatchlistProvider')
  }

  return context
}