import type { ReactNode } from 'react'
import { Avatar } from './Avatar'

type EloraMessageProps = {
  children: ReactNode
  avatarSrc?: string
  tip?: boolean
}

export function EloraMessage({ children, avatarSrc, tip = false }: EloraMessageProps) {
  return (
    <section
      className={[
        'rounded-lg border p-4',
        tip ? 'border-border bg-surface-muted' : 'border-accent-border bg-surface-elevated',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        {avatarSrc ? <Avatar src={avatarSrc} size="elora" alt="" /> : null}

        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wide text-accent">Elora</p>
          <p className="mt-1.5 text-[13px] leading-[1.4] text-content">{children}</p>
        </div>
      </div>
    </section>
  )
}
