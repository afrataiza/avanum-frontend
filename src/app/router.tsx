import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout'
import { PlaceholderPage } from '@/pages/PlaceholderPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppShell>
        <PlaceholderPage />
      </AppShell>
    ),
  },
  {
    path: '/explorar',
    element: (
      <AppShell>
        <PlaceholderPage />
      </AppShell>
    ),
  },
  {
    path: '/biblioteca',
    element: (
      <AppShell>
        <PlaceholderPage />
      </AppShell>
    ),
  },
  {
    path: '/mapa',
    element: (
      <AppShell>
        <PlaceholderPage />
      </AppShell>
    ),
  },
])
