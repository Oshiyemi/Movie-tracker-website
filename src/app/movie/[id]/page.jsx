import { MediaDetails } from '@/components/movie/media-details'

export default async function MovieDetailsPage({ params }) {
  const resolvedParams = await params
  return <MediaDetails mediaType="movie" mediaId={resolvedParams?.id} />
}
