import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean
}

export function Button({ className = '', fullWidth = false, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={[
        'focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-content',
        'bg-accent px-5 py-3 text-sm font-bold text-surface transition-opacity',
        'hover:opacity-90 disabled:opacity-50',
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    />
  )
}
