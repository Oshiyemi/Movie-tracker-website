import { Bookmark, Film, Search, Sparkles, Tv } from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Fast search',
    description: 'Debounced title search that avoids duplicate API requests.',
  },
  {
    icon: Sparkles,
    title: 'Trending feed',
    description: 'Daily trending highlights and popular movie discovery.',
  },
  {
    icon: Bookmark,
    title: 'Watchlist',
    description: 'Personal watchlist persisted in local storage.',
  },
  {
    icon: Film,
    title: 'Movie details',
    description: 'Rich movie metadata with cast-ready TMDB responses.',
  },
  {
    icon: Tv,
    title: 'TV details',
    description: 'Season and episode context for TV titles.',
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-4 pb-8 lg:px-8">
      <header className="mb-10 text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">About Movie Tracker</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Movie Tracker is a modern TMDB-powered app for discovering movies and TV shows,
          finding details quickly, and saving titles to your watchlist.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <feature.icon className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
          </article>
        ))}
      </section>

      <footer className="mt-10 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Data provided by{' '}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary underline underline-offset-4"
        >
          TMDB
        </a>
        . This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  )
}