'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bookmark, Film, Menu, Search, X } from 'lucide-react'
import { useWatchlist } from '@/context/watchlist-context'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
  { href: '/watchlist', label: 'Watchlist' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { watchlist } = useWatchlist()

  const [query, setQuery] = useState('')
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const watchlistCount = watchlist.length

  const activePath = useMemo(() => pathname, [pathname])

  function isActive(href) {
    return activePath === href
  }

  function submitSearch(event) {
    event.preventDefault()

    const normalized = query.trim()
    if (!normalized) {
      return
    }

    router.push(`/search?q=${encodeURIComponent(normalized)}`)
    setIsMobileOpen(false)
    setQuery('')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Film className="h-4 w-4" />
          </span>
          <span className="font-heading">Movie Tracker</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive(item.href)
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {item.label}
              {item.href === '/watchlist' && watchlistCount > 0 ? (
                <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                  {watchlistCount}
                </span>
              ) : null}
            </Link>
          ))}
        </div>

        <form onSubmit={submitSearch} className="hidden items-center gap-2 lg:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Quick search"
              className="h-9 w-56 rounded-lg border border-border bg-card pl-9 pr-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>

          <Link
            href="/watchlist"
            aria-label="Open watchlist"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:text-foreground"
          >
            <Bookmark className="h-4 w-4" />
            {watchlistCount > 0 ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {watchlistCount}
              </span>
            ) : null}
          </Link>
        </form>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden"
          onClick={() => setIsMobileOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {isMobileOpen ? (
        <div className="border-t border-border/60 px-4 pb-4 pt-3 md:hidden">
          <form onSubmit={submitSearch} className="mb-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search movies and TV shows"
                className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            </div>
          </form>

          <div className="grid gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive(item.href)
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {item.label}
                {item.href === '/watchlist' && watchlistCount > 0 ? ` (${watchlistCount})` : ''}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}