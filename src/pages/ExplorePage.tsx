import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { catalogApi } from '@/lib/api/catalog'
import { ApiError } from '@/lib/api/client'
import type { Book } from '@/lib/api/types'
import { Button, Card, FeedbackState, Input } from '@/components/ui'

function BookCover({ book, compact = false }: { book: Book; compact?: boolean }) {
  return (
    <div className={compact ? 'h-28 w-20 shrink-0 overflow-hidden bg-surface-muted' : 'aspect-[2/3] w-full overflow-hidden bg-surface-muted'}>
      {book.coverUrl ? (
        <img src={book.coverUrl} alt={`Capa de ${book.title}`} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-3 text-center text-xs text-content-muted">
          Sem capa
        </div>
      )}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ExplorePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [results, setResults] = useState<Book[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'empty' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const search = async (value: string) => {
    const normalizedQuery = value.trim()
    setQuery(value)
    setSearchParams(normalizedQuery ? { q: normalizedQuery } : {})
    setError(null)

    if (!normalizedQuery) {
      setResults([])
      setTotal(0)
      setStatus('idle')
      return
    }

    setStatus('loading')

    try {
      const response = await catalogApi.search(normalizedQuery)
      setResults(response.items)
      setTotal(response.total)
      setStatus(response.items.length ? 'success' : 'empty')
    } catch (cause) {
      setResults([])
      setTotal(0)
      setStatus('error')
      setError(
        cause instanceof ApiError
          ? cause.message
          : 'Não foi possível buscar os livros agora.',
      )
    }
  }

  useEffect(() => {
    const initialQuery = searchParams.get('q')
    if (initialQuery) {
      void search(initialQuery)
    }
    // A URL é a fonte inicial da busca; novas buscas são disparadas pelo formulário.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void search(query)
  }

  return (
    <div className="screen-padding pb-8 pt-6">
      <header className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">Catálogo</p>
        <h1 className="font-display text-[32px] font-semibold leading-none text-content">Explorar</h1>
        <p className="mt-2 text-sm leading-5 text-content-muted">
          Encontre seu próximo livro.
        </p>
      </header>

      <form onSubmit={submit} role="search">
        <label className="sr-only" htmlFor="book-search">Buscar livros ou autores</label>
        <div className="relative">
          <Input
            id="book-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar livros ou autores"
            className="pr-12"
            autoComplete="off"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-accent"
          >
            <SearchIcon />
          </button>
        </div>
      </form>

      <div className="mt-6">
        {status === 'idle' ? (
          <FeedbackState
            title="O que você quer descobrir?"
            description="Pesquise por título, autor ou assunto para encontrar novos livros."
          />
        ) : null}

        {status === 'loading' ? (
          <div className="space-y-3" aria-live="polite" aria-busy="true">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-lg border border-border bg-surface-elevated" />
            ))}
          </div>
        ) : null}

        {status === 'empty' ? (
          <FeedbackState
            title="Nenhum livro encontrado"
            description={`Não encontramos resultados para “${query.trim()}”. Tente outro título ou autor.`}
          />
        ) : null}

        {status === 'error' ? (
          <FeedbackState
            title="Não foi possível buscar"
            description={error ?? 'Tente novamente em alguns instantes.'}
            action={<Button variant="secondary" onClick={() => void search(query)}>Tentar novamente</Button>}
          />
        ) : null}

        {status === 'success' ? (
          <section aria-label="Resultados da busca">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-[22px] font-semibold text-content">Resultados</h2>
              <span className="text-xs text-content-muted">{total.toLocaleString('pt-BR')}</span>
            </div>

            <div className="space-y-3">
              {results.map((book) => (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => navigate(`/explorar/livro/${encodeURIComponent(book.id)}`)}
                  className="focus-ring block w-full text-left"
                >
                  <Card className="flex gap-4 transition-opacity hover:opacity-90">
                    <BookCover book={book} compact />
                    <div className="min-w-0 py-1">
                      <h3 className="line-clamp-2 font-display text-[20px] font-semibold leading-5 text-content">
                        {book.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-content-muted">
                        {book.authors.length ? book.authors.join(', ') : 'Autor desconhecido'}
                      </p>
                      {book.publicationYear ? (
                        <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-accent">
                          {book.publicationYear}
                        </p>
                      ) : null}
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}

export function BookDetailsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const [book, setBook] = useState<Book | null>(null)
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'empty'>('loading')

  useEffect(() => {
    if (!id) {
      setStatus('empty')
      return
    }

    let active = true

    catalogApi.getById(id)
      .then((result) => {
        if (active) {
          setBook(result)
          setStatus('success')
        }
      })
      .catch(() => {
        if (active) setStatus('error')
      })

    return () => {
      active = false
    }
  }, [id])

  if (status === 'loading') {
    return <div className="screen-padding py-8"><div className="h-96 animate-pulse rounded-lg bg-surface-elevated" /></div>
  }

  if (status !== 'success' || !book) {
    return (
      <div className="screen-padding py-8">
        <FeedbackState
          title={status === 'empty' ? 'Livro não encontrado' : 'Não foi possível carregar o livro'}
          description="Volte para a busca e tente novamente."
          action={<Button variant="secondary" onClick={() => navigate('/explorar')}>Voltar para explorar</Button>}
        />
      </div>
    )
  }

  return (
    <div className="screen-padding pb-8 pt-5">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="focus-ring mb-6 inline-flex items-center gap-2 rounded-md py-2 text-sm font-semibold text-content-muted"
      >
        <BackIcon />
        Voltar
      </button>

      <article>
        <div className="flex gap-5">
          <BookCover book={book} compact />
          <div className="min-w-0">
            <h1 className="font-display text-[28px] font-semibold leading-7 text-content">{book.title}</h1>
            <p className="mt-2 text-sm leading-5 text-content-muted">
              {book.authors.length ? book.authors.join(', ') : 'Autor desconhecido'}
            </p>
            {book.publicationYear ? (
              <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-accent">
                {book.publicationYear}
              </p>
            ) : null}
          </div>
        </div>

        {book.synopsis ? (
          <section className="mt-8">
            <h2 className="font-display text-[22px] font-semibold text-content">Sinopse</h2>
            <p className="mt-3 text-sm leading-6 text-content-muted">{book.synopsis}</p>
          </section>
        ) : null}

        {(book.categories.length || book.language || book.isbn10 || book.isbn13) ? (
          <section className="mt-8">
            <h2 className="font-display text-[22px] font-semibold text-content">Informações</h2>
            <dl className="mt-3 space-y-2 text-sm">
              {book.language ? <div className="flex justify-between gap-4 border-b border-border py-2"><dt className="text-content-muted">Idioma</dt><dd>{book.language}</dd></div> : null}
              {book.isbn13 ? <div className="flex justify-between gap-4 border-b border-border py-2"><dt className="text-content-muted">ISBN-13</dt><dd>{book.isbn13}</dd></div> : null}
              {book.isbn10 ? <div className="flex justify-between gap-4 border-b border-border py-2"><dt className="text-content-muted">ISBN-10</dt><dd>{book.isbn10}</dd></div> : null}
            </dl>
          </section>
        ) : null}

        <div className="mt-8">
          <Button fullWidth onClick={() => navigate('/biblioteca')}>
            Adicionar à biblioteca
          </Button>
        </div>
      </article>
    </div>
  )
}
