import { AppShell } from '@/components/layout'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { JourneyPage } from '@/pages/JourneyPage'
import { OnboardingPage } from '@/pages/OnboardingPage'

export function JourneyRoute() {
  return (
    <AppShell>
      <JourneyPage />
    </AppShell>
  )
}

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
