import { NextResponse } from 'next/server'
import { getTrending } from '@/services/tmdb'

export async function GET() {
  try {
    const payload = await getTrending()
    return NextResponse.json(payload)
  } catch (error) {
    console.error('GET /api/trending failed:', error)
    return NextResponse.json({ error: 'Failed to fetch trending titles.', results: [] }, { status: 500 })
  }
}