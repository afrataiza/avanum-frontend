import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth'
import { ApiIntegrationPage } from '@/pages/ApiIntegrationPage'
import {
  JourneyRoute,
  OnboardingRoute,
  ProtectedScreen,
  ExploreRoute,
  BookDetailsRoute,
} from './RouteScreens'
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
        element: <JourneyRoute />,
      },
      {
        path: 'explorar',
        element: <ExploreRoute />,
      },
      {
        path: 'explorar/livro/:id',
        element: <BookDetailsRoute />,
      },
      {
        path: 'biblioteca',
        element: <ProtectedScreen />,
      },
      {
        path: 'mapa',
        element: <ProtectedScreen />,
      },
      {
        path: 'dev/api',
        element: <ApiIntegrationPage />,
      },
    ],
  },
])
