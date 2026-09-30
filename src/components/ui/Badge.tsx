import type { HTMLAttributes } from 'react'

export function Badge({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-sm border border-border bg-surface-elevated px-2.5 py-1.5',
        'text-xs font-bold text-accent',
        className,
      ].join(' ')}
      {...props}
    />
  )
}
