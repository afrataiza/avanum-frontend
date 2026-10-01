import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth'
import { OnboardingRoute, ProtectedScreen } from './RouteScreens'
import { SignInPage } from '@/pages/SignInPage'

export const router = createBrowserRouter([
  {
    path: '/entrar',
    element: <SignInPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/onboarding',
        element: <OnboardingRoute />,
      },
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
