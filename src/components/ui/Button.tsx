import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean
  variant?: 'primary' | 'secondary'
}

const variants = {
  primary: 'border-content bg-accent text-surface',
  secondary: 'border-border bg-surface-button-secondary text-content',
} as const

export function Button({
  className = '',
  fullWidth = false,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={[
        'focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md',
        'px-5 py-3 text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50 border',
        variants[variant],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    />
  )
}
