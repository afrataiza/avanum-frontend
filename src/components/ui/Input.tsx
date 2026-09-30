import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ className = '', label, error, id, ...props }: InputProps) {
  const inputId = id ?? props.name

  return (
    <label className="block">
      {label ? (
        <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-accent">
          {label}
        </span>
      ) : null}

      <input
        id={inputId}
        className={[
          'focus-ring min-h-12 w-full rounded-md border bg-surface-muted px-3.5 py-3',
          'text-[15px] font-semibold text-content placeholder:text-content-muted',
          'border-border outline-none',
          error ? 'border-accent' : '',
          className,
        ].join(' ')}
        aria-invalid={Boolean(error)}
        {...props}
      />

      {error ? <span className="mt-2 block text-xs text-content-muted">{error}</span> : null}
    </label>
  )
}
