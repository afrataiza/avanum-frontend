import type { ImgHTMLAttributes } from 'react'

type AvatarProps = ImgHTMLAttributes<HTMLImageElement> & {
  size?: 'user' | 'elora' | 'onboarding'
}

const sizes = {
  user: 'size-11 rounded-[22px]',
  elora: 'size-10 rounded-[20px]',
  onboarding: 'size-12 rounded-[24px]',
} as const

export function Avatar({ className = '', size = 'user', alt = '', ...props }: AvatarProps) {
  return (
    <img
      alt={alt}
      className={[
        sizes[size],
        'border-[1.5px] border-accent object-cover',
        className,
      ].join(' ')}
      {...props}
    />
  )
}
