export function imageUrl(path, size = 'w500') {
  if (!path) {
    return null
  }

  return `https://image.tmdb.org/t/p/${size}${path}`
}