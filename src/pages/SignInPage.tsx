import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, FeedbackState } from '@/components/ui'
import { useAuth } from '@/features/auth'

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M21.805 12.23c0-.79-.065-1.38-.206-1.995H12.24v3.78h5.5c-.111.94-.676 2.36-1.944 3.315l-.018.127 2.82 2.186.195.02c1.791-1.654 3.012-4.088 3.012-7.433Z"
        fill="currentColor"
      />
      <path
        d="M12.24 21.999c2.565 0 4.718-.845 6.291-2.297l-2.997-2.333c-.802.554-1.878.94-3.294.94-2.5 0-4.62-1.653-5.377-3.938l-.116.01-2.937 2.275-.038.114c1.562 3.1 4.761 5.229 8.468 5.229Z"
        fill="currentColor"
      />
      <path
        d="M6.863 14.371A6.372 6.372 0 0 1 6.51 12c0-.825.126-1.624.352-2.37l-.006-.159-2.973-2.311-.097.046A9.5 9.5 0 0 0 2.76 12c0 1.538.37 2.988 1.026 4.273l3.077-1.902Z"
        fill="currentColor"
      />
      <path
        d="M12.24 5.691c1.785 0 3.017.77 3.711 1.414l2.707-2.644C16.948 2.942 14.805 2 12.24 2 8.531 2 5.332 4.129 3.77 7.229l3.09 2.4c.76-2.285 2.878-3.938 5.38-3.938Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function SignInPage() {
  const { isLoading, signInWithGoogle, user } = useAuth()
  const navigate = useNavigate()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isLoading && user) {
    navigate('/', { replace: true })
    return null
  }

  async function handleGoogleSignIn() {
    setError(null)
    setIsSigningIn(true)

    const result = await signInWithGoogle()

    if (result.error) {
      setError('Não foi possível iniciar o acesso com o Google.')
      setIsSigningIn(false)
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface px-6 py-10">
      <section className="w-full max-w-sm text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Avanum
        </p>

        <h1 className="font-display text-4xl font-semibold text-content">
          Sua jornada começa aqui
        </h1>

        <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-content-muted">
          Entre com sua conta Google para continuar sua aventura de leitura.
        </p>

        <div className="mt-8">
          <Button
            fullWidth
            variant="secondary"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
          >
            <GoogleIcon />
            {isSigningIn ? 'Abrindo o Google...' : 'Continuar com Google'}
          </Button>
        </div>

        {error ? (
          <div className="mt-5">
            <FeedbackState title="Não foi possível entrar" description={error} />
          </div>
        ) : null}
      </section>
    </main>
  )
}
