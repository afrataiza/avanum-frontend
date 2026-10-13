import type { ReactNode } from 'react'
import { BottomNavigation } from '@/components/navigation'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="h-dvh overflow-hidden bg-surface text-content">
      <div className="mx-auto flex h-dvh min-h-0 w-full max-w-md flex-col">
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        <BottomNavigation />
      </div>
    </div>
  )
}
