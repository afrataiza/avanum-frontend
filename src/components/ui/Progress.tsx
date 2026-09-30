import type { HTMLAttributes } from 'react'

type ProgressProps = Omit<HTMLAttributes<HTMLDivElement>, 'aria-valuenow'> & {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  size?: 'sm' | 'md'
}

export function Progress({
  className = '',
  value,
  max = 100,
  label,
  showValue = false,
  size = 'sm',
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={['space-y-2', className].join(' ')} {...props}>
      {label || showValue ? (
        <div className="flex items-center justify-between gap-3 text-xs text-content-muted">
          {label ? <span>{label}</span> : <span />}
          {showValue ? (
            <span className="font-semibold text-content">{Math.round(percentage)}%</span>
          ) : null}
        </div>
      ) : null}

      <div
        className={[
          'w-full overflow-hidden rounded-pill bg-surface-muted',
          size === 'sm' ? 'h-1' : 'h-1.5',
        ].join(' ')}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.min(max, Math.max(0, value))}
      >
        <div
          className="h-full rounded-pill bg-accent transition-[width]"
          style={{ width: percentage + '%' }}
        />
      </div>
    </div>
  )
}
