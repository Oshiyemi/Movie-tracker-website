import { Film } from 'lucide-react'

export function EmptyState({ icon: Icon = Film, title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}