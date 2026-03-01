# Movie Tracker App

A Next.js App Router movie tracker that supports SSR pages and API routes.

## Local setup

```bash
pnpm install
pnpm dev
```

## Environment variables

Create `.env.local`:

```bash
MOVIE_API_KEY=YOUR_SERVER_SIDE_TMDB_KEY
```

- `MOVIE_API_KEY` is used server-side in API routes and never exposed to the client bundle.

## Build and run

```bash
pnpm run build
pnpm start
```

Optional static-export fallback:

```bash
pnpm run build:static
```

This generates static output (`out`) only when `NETLIFY_NEXT_EXPORT=true` is set.
Use this only if you intentionally disable SSR/API routes.

## Netlify settings

- Build command: `pnpm run build`
- Publish directory: leave empty (do not set manually)
- Environment variables:
  - `MOVIE_API_KEY`

`netlify.toml` already avoids publish overrides so Netlify's Next.js adapter can manage SSR/API output.
