import { Space_Grotesk, Sora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { WatchlistProvider } from '@/context/watchlist-context'
import { Navbar } from '@/components/layout/navbar'
import './globals.css'

const headingFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
})

const bodyFont = Sora({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata = {
  title: 'Movie Tracker',
  description:
    'Discover trending movies and shows, search titles instantly, and keep a personal watchlist.',
}

export const viewport = {
  themeColor: '#0b1324',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <WatchlistProvider>
          <Navbar />
          <main className="pb-16 pt-20">{children}</main>
        </WatchlistProvider>
        <Analytics />
      </body>
    </html>
  )
}