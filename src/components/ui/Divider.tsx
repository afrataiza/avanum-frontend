import type { HTMLAttributes } from 'react'

export function Divider({ className = '', ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={['my-2 border-0 border-t border-border', className].join(' ')} {...props} />
}
