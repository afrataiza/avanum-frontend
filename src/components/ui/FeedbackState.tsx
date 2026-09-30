import type { ReactNode } from 'react'

type FeedbackStateProps = {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function FeedbackState({ title, description, icon, action }: FeedbackStateProps) {
  return (
    <section className="flex flex-col items-center px-6 py-8 text-center">
      {icon ? <div className="mb-3 text-accent">{icon}</div> : null}
      <h2 className="font-display text-[22px] font-semibold text-content">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-5 text-content-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  )
}
