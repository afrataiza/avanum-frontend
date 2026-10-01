import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { FeedbackState } from '@/components/ui'
import { useAuth } from '@/features/auth'

export function ProtectedRoute() {
  const { isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <FeedbackState
          title="Preparando sua jornada"
          description="Estamos restaurando sua sessão."
        />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/entrar" replace state={{ from: location }} />
  }

  return <Outlet />
}
