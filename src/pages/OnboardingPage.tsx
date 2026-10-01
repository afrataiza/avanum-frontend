import { Navigate, useNavigate } from 'react-router-dom'
import { Avatar, Button, FeedbackState } from '@/components/ui'
import { useAuth } from '@/features/auth'

function getUserName(user: ReturnType<typeof useAuth>['user']) {
  const metadata = user?.user_metadata

  return metadata?.full_name ?? metadata?.name ?? user?.email?.split('@')[0] ?? 'Exploradora'
}

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || 'Exploradora'
}

export function OnboardingPage() {
  const { completeOnboarding, isLoading, user } = useAuth()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-6">
        <FeedbackState
          title="Preparando sua jornada"
          description="Estamos carregando seu perfil."
        />
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/entrar" replace />
  }

  if (user.user_metadata?.onboarding_completed === true) {
    return <Navigate to="/" replace />
  }

  const fullName = getUserName(user)
  const firstName = getFirstName(fullName)
  const avatarUrl = user.user_metadata?.avatar_url

  async function handleStart() {
    const { error } = await completeOnboarding()

    if (!error) {
      navigate('/', { replace: true })
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface px-6 py-10">
      <section className="flex w-full max-w-sm flex-col items-center text-center">
        {avatarUrl ? (
          <Avatar src={avatarUrl} size="onboarding" alt="" />
        ) : (
          <div className="flex size-12 items-center justify-center rounded-3xl border-[1.5px] border-accent bg-surface-elevated text-sm font-bold text-accent">
            {firstName.charAt(0).toUpperCase()}
          </div>
        )}

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Bem-vinda ao Avanum
        </p>

        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-content">
          Olá, {firstName}.
        </h1>

        <p className="mt-4 max-w-xs text-sm leading-6 text-content-muted">
          Sua jornada de leitura começa agora. Vamos descobrir novas histórias, registrar suas
          leituras e explorar cada conquista pelo caminho.
        </p>

        <div className="mt-8 w-full">
          <Button fullWidth onClick={handleStart}>
            Começar minha jornada
          </Button>
        </div>
      </section>
    </main>
  )
}
