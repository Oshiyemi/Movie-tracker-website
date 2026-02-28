function LoadingCard({ compact = false }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className={`w-full animate-pulse bg-secondary ${compact ? 'aspect-[4/5]' : 'aspect-[2/3]'}`} />
      <div className="space-y-2 p-3">
        <div className="h-4 w-4/5 animate-pulse rounded bg-secondary" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
      </div>
    </div>
  )
}

export function LoadingGrid({ count = 10, compact = false }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <LoadingCard key={index} compact={compact} />
      ))}
    </div>
  )
}