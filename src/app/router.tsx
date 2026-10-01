import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth'
import { AppShell } from '@/components/layout'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { SignInPage } from '@/pages/SignInPage'

function ProtectedScreen() {
  return (
    <AppShell>
      <PlaceholderPage />
    </AppShell>
  )
}

export const router = createBrowserRouter([
  {
    path: '/entrar',
    element: <SignInPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <ProtectedScreen />,
      },
      {
        path: 'explorar',
        element: <ProtectedScreen />,
      },
      {
        path: 'biblioteca',
        element: <ProtectedScreen />,
      },
      {
        path: 'mapa',
        element: <ProtectedScreen />,
      },
    ],
  },
])
