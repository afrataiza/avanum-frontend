import { AppShell } from '@/components/layout'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { JourneyPage } from '@/pages/JourneyPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { ExplorePage, BookDetailsPage } from '@/pages/ExplorePage'

export function JourneyRoute() {
  return (
    <AppShell>
      <JourneyPage />
    </AppShell>
  )
}

export function ExploreRoute() {
  return (
    <AppShell>
      <ExplorePage />
    </AppShell>
  )
}

export function BookDetailsRoute() {
  return (
    <AppShell>
      <BookDetailsPage />
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
