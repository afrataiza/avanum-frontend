import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  compact?: boolean
}

export function Card({ className = '', compact = false, ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-lg border border-border bg-surface-elevated',
        compact ? 'rounded-md p-3' : 'p-4',
        className,
      ].join(' ')}
      {...props}
    />
  )
}
