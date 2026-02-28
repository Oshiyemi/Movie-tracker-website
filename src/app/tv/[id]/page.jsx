import { MediaDetails } from '@/components/movie/media-details'

export default async function TVDetailsPage({ params }) {
  const resolvedParams = await params
  return <MediaDetails mediaType="tv" mediaId={resolvedParams?.id} />
}
