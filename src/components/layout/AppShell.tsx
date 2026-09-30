import type { ReactNode } from 'react'
import { BottomNavigation } from '@/components/navigation'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-surface text-content">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        <BottomNavigation />
      </div>
    </div>
  )
}
