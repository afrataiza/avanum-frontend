import { AppShell } from '@/components/layout'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { OnboardingPage } from '@/pages/OnboardingPage'

export function ProtectedScreen() {
  return (
    <AppShell>
      <PlaceholderPage />
    </AppShell>
  )
}

export function OnboardingRoute() {
  return <OnboardingPage />
}
