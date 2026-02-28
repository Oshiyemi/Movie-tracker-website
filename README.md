# Movie Tracker App

A Next.js movie tracker frontend that lets you:

- Explore trending and popular movies
- Search movies and TV shows
- View detailed movie/TV metadata
- Save titles to a local watchlist

The app uses TMDB through server-side Next.js API routes.

## Tech Stack

- Next.js (App Router)
- React (JavaScript)
- TailwindCSS

## 1) Install dependencies

```bash
pnpm install
```

If you prefer npm:

```bash
npm install
```

## 2) Configure environment variables

Create a `.env.local` file in the project root and add:

```bash
MOVIE_API_KEY=YOUR_TMDB_API_KEY
```

Use `.env.example` as the template:

```bash
MOVIE_API_KEY=PASTE_YOUR_API_KEY_HERE
```

All API calls read the key from `MOVIE_API_KEY` in server code (`src/services/config.js` and `src/services/tmdb.js`).

## 3) Run the project

```bash
pnpm dev
```

Open `http://localhost:3000`.

## 4) Build and start production

```bash
pnpm build
pnpm start
```

## TailwindCSS Setup

TailwindCSS is configured with:

- `tailwindcss`
- `@tailwindcss/postcss`
- `postcss`

Key files:

- `postcss.config.mjs`
- `tailwind.config.js`
- `src/app/globals.css`

## Project Structure

- `src/app/` - routes, layouts, and API route handlers
- `src/components/` - reusable UI and feature components
- `src/context/` - watchlist state management
- `src/hooks/` - reusable hooks
- `src/services/` - API clients and TMDB service layer
- `src/utils/` - pure utility helpers

## Notes

- API routes prevent exposing the TMDB key to the browser.
- Watchlist data is persisted in `localStorage`.
- `.env` is ignored in `.gitignore`.