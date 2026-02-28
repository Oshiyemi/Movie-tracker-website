export function ErrorState({ message, hint, onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-300/50 bg-rose-500/10 p-5">
      <p className="text-sm font-medium text-foreground">{message}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold transition hover:bg-secondary"
        >
          Retry
        </button>
      ) : null}
    </div>
  )
}