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

function CompassIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m15.9 8.1-2.5 5.3-5.3 2.5 2.5-5.3 5.3-2.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        d="M5 12h13m-5-5 5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

export function OnboardingPage() {
  const { completeOnboarding, isLoading, user } = useAuth()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-surface px-6">
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
    <main className="min-h-dvh overflow-y-auto bg-surface px-6 py-5">
      <section className="mx-auto flex w-full max-w-[354px] flex-col pb-6">
        <header className="flex flex-col items-center text-center">
          <div className="flex size-8 items-center justify-center text-accent">
            <CompassIcon />
          </div>

          <div className="mt-2 font-display text-[30px] font-semibold leading-none tracking-[0.08em] text-accent">
            AVANUM
          </div>

          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.08em] text-content-accent-muted">
            Diário de bordo literário
          </p>
        </header>

        <div className="mt-6 aspect-[354/221] w-full overflow-hidden rounded-[16px] border border-border bg-surface-muted">
          <img
            src="/onboarding-illustration.png"
            alt="Biblioteca encantada do Avanum"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-6 text-center">
          <h1 className="font-display text-[30px] font-semibold leading-tight text-content">
            Olá, {firstName}!
          </h1>

          <p className="mt-3 text-[14px] leading-[21px] text-content-muted">
            Avanum é um mundo onde cada página folheada é uma colina escalada e cada livro lido é
            uma grande expedição concluída.
          </p>
        </div>

        <div className="my-6 border-t border-dashed border-content-accent-muted" />

        <section
          aria-label="Mensagem da Elora"
          className="rounded-[12px] border border-accent-border bg-surface-elevated px-3 py-3"
        >
          <div className="flex items-center gap-3">
            <Avatar src="/elora-avatar.png" size="elora" alt="Elora" />

            <div className="min-w-0 text-left">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-accent">Elora</p>
              <p className="mt-0.5 text-[13px] leading-[17px] text-content">
                "Bem-vinda ao Avanum! Sou a Elora, sua guia neste mundo de histórias."
              </p>
            </div>
          </div>
        </section>

        <div className="mt-9">
          <Button
            fullWidth
            onClick={handleStart}
            className="min-h-11 gap-2 rounded-[12px] px-5 py-2.5 text-sm"
          >
            Iniciar Expedição
            <ArrowRightIcon />
          </Button>
        </div>
      </section>
    </main>
  )
}
