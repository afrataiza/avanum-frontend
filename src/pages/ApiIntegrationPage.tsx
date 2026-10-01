import { useEffect, useState } from 'react'
import { ApiError, catalogApi, type Book } from '@/lib/api'
import { Button, Card, FeedbackState } from '@/components/ui'

export function ApiIntegrationPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    catalogApi
      .search('the hobbit')
      .then((result) => {
        if (isMounted) setBooks(result.items)
      })
      .catch((cause: unknown) => {
        if (!isMounted) return

        setError(
          cause instanceof ApiError
            ? `${cause.message} (HTTP ${cause.status})`
            : 'Não foi possível consultar o catálogo.',
        )
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="screen-padding py-8">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          ATSA-27
        </p>
        <h1 className="mt-2 font-display text-3xl text-content">
          Integração com o backend
        </h1>
        <p className="mt-2 text-sm leading-6 text-content-muted">
          Tela técnica temporária para validar o cliente de API com o backend real.
        </p>

        <Card className="mt-6">
          {isLoading && (
            <FeedbackState
              title="Consultando catálogo"
              description="Buscando livros através da camada de integração."
            />
          )}

          {!isLoading && error && (
            <FeedbackState title="Falha na integração" description={error} />
          )}

          {!isLoading && !error && (
            <div className="space-y-3">
              <p className="text-sm text-content-muted">
                Resultado de <strong className="text-content">books-search</strong>:
              </p>

              {books.map((book) => (
                <div
                  key={book.id}
                  className="rounded-md border border-border bg-surface-muted p-4"
                >
                  <p className="font-display text-xl text-content">{book.title}</p>
                  <p className="mt-1 text-sm text-content-muted">
                    {book.authors.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => window.location.reload()}
        >
          Reexecutar consulta
        </Button>
      </div>
    </main>
  )
}
