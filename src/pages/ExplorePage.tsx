import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { FormEvent } from 'react'
import { catalogApi } from '@/lib/api/catalog'
import { libraryApi } from '@/lib/api/library'
import { ApiError } from '@/lib/api/client'
import type { AddToLibraryInput, Book } from '@/lib/api/types'
import { Button, Card, FeedbackState, Input } from '@/components/ui'

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2]">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M12 7v10M7 12h10" strokeLinecap="round" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2]">
      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="M6.5 4.5A1.5 1.5 0 0 1 8 3h8a1.5 1.5 0 0 1 1.5 1.5V21l-5.5-3-5.5 3V4.5Z" strokeLinejoin="round" />
    </svg>
  )
}

function BookCover({
  book,
  className = '',
  alt,
}: {
  book: Book
  className?: string
  alt?: string
}) {
  return (
    <div className={`shrink-0 overflow-hidden bg-surface-muted ${className}`}>
      {book.coverUrl ? (
        <img
          src={book.coverUrl}
          alt={alt ?? `Capa de ${book.title}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-2 text-center text-[10px] text-content-muted">
          Sem capa
        </div>
      )}
    </div>
  )
}

function BookResultCard({
  book,
  onOpen,
}: {
  book: Book
  onOpen: () => void
}) {
  const category = book.categories[0]

  return (
    <button
      type="button"
      onClick={onOpen}
      className="focus-ring block w-full text-left"
    >
      <Card className="flex min-h-24 items-center gap-4 rounded-lg p-3 transition-opacity hover:opacity-90">
        <BookCover book={book} className="h-[72px] w-[50px]" />

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-display text-[17px] font-semibold leading-[1.05] text-content">
            {book.title}
          </h3>
          <p className="mt-1 text-[13px] leading-4 text-content-muted">
            {book.authors.length ? book.authors.join(', ') : 'Autor desconhecido'}
          </p>
          {category ? (
            <span className="mt-2 inline-flex rounded-sm bg-surface-muted px-2 py-1 text-[10px] font-medium text-content-accent-muted">
              {category}
            </span>
          ) : null}
        </div>

        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent text-accent"
        >
          <PlusIcon />
        </span>
      </Card>
    </button>
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

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void search(query)
  }

  return (
    <div className="screen-padding pb-8 pt-12">
      <header>
        <h1 className="font-display text-[28px] font-semibold leading-none text-content">
          Explorar Mundo
        </h1>
      </header>

      <form onSubmit={submit} role="search" className="mt-5">
        <label className="sr-only" htmlFor="book-search">
          Buscar livros ou autores
        </label>

        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-accent">
            <SearchIcon />
          </span>

          <Input
            id="book-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar livros, autores..."
            className="pl-11 pr-4"
            autoComplete="off"
          />
        </div>
      </form>

      <div className="my-5 border-b border-dashed border-content-accent-muted/70" />

      <div>
        {status === 'idle' ? (
          <FeedbackState
            title="Descubra sua próxima leitura"
            description="Pesquise por título ou autor para encontrar novos livros."
          />
        ) : null}

        {status === 'loading' ? (
          <div className="space-y-3" aria-live="polite" aria-busy="true">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-lg border border-border bg-surface-elevated"
              />
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
            action={
              <Button variant="secondary" onClick={() => void search(query)}>
                Tentar novamente
              </Button>
            }
          />
        ) : null}

        {status === 'success' ? (
          <section aria-label="Resultados da busca">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="font-display text-[22px] font-semibold text-content">
                Resultados
              </h2>
              <span className="text-xs text-content-muted">
                {total.toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="space-y-3">
              {results.map((book) => (
                <BookResultCard
                  key={book.id}
                  book={book}
                  onOpen={() =>
                    navigate(`/explorar/livro/${encodeURIComponent(book.id)}`)
                  }
                />
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
  const { id } = useParams()
  const [book, setBook] = useState<Book | null>(null)
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'empty'>('loading')
  const [libraryStatus, setLibraryStatus] = useState<'idle' | 'adding' | 'added' | 'error'>('idle')
  const [libraryError, setLibraryError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setStatus('empty')
      return
    }

    let active = true

    catalogApi
      .getById(id)
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

  const addToLibrary = async () => {
    if (!book) return

    setLibraryStatus('adding')
    setLibraryError(null)

    const payload: AddToLibraryInput = {
      externalId: book.id,
      title: book.title,
      authors: book.authors,
      synopsis: book.synopsis,
      coverUrl: book.coverUrl,
      publicationYear: book.publicationYear,
      categories: book.categories,
      language: book.language,
      isbn10: book.isbn10,
      isbn13: book.isbn13,
    }

    try {
      await libraryApi.add(payload)
      setLibraryStatus('added')
    } catch (cause) {
      setLibraryStatus('error')
      setLibraryError(
        cause instanceof ApiError
          ? cause.message
          : 'Não foi possível adicionar o livro à biblioteca.',
      )
    }
  }

  if (status === 'loading') {
    return (
      <div className="screen-padding py-8">
        <div className="mx-auto h-64 w-44 animate-pulse rounded-lg bg-surface-elevated" />
      </div>
    )
  }

  if (status !== 'success' || !book) {
    return (
      <div className="screen-padding py-8">
        <FeedbackState
          title={status === 'empty' ? 'Livro não encontrado' : 'Não foi possível carregar o livro'}
          description="Volte para a busca e tente novamente."
          action={
            <Button variant="secondary" onClick={() => navigate('/explorar')}>
              Voltar para explorar
            </Button>
          }
        />
      </div>
    )
  }

  const category = book.categories[0]

  return (
    <div className="screen-padding pb-8 pt-5">
      <header className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="focus-ring inline-flex items-center gap-1 rounded-md py-2 text-sm font-semibold text-accent"
        >
          <BackIcon />
          Voltar
        </button>

        <button
          type="button"
          aria-label="Salvar livro"
          className="focus-ring rounded-md p-2 text-content-muted"
          onClick={() => undefined}
        >
          <BookmarkIcon />
        </button>
      </header>

      <article className="mt-7">
        <div className="flex flex-col items-center text-center">
          <BookCover book={book} className="h-[140px] w-[100px] rounded-lg" />

          <h1 className="mt-5 max-w-[330px] font-display text-[28px] font-semibold leading-[1.02] text-content">
            {book.title}
          </h1>

          <p className="mt-2 text-[15px] text-content-muted">
            {book.authors.length ? book.authors.join(', ') : 'Autor desconhecido'}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-2">
          {category ? (
            <div className="flex min-h-8 items-center justify-center gap-1 rounded-md border border-border bg-surface-elevated px-2 text-[11px] font-semibold text-content">
              {category}
            </div>
          ) : null}

          {book.publicationYear ? (
            <div className="flex min-h-8 items-center justify-center gap-1 rounded-md border border-border bg-surface-elevated px-2 text-[11px] font-semibold text-content">
              {book.publicationYear}
            </div>
          ) : null}

          {book.language ? (
            <div className="flex min-h-8 items-center justify-center gap-1 rounded-md border border-border bg-surface-elevated px-2 text-[11px] font-semibold text-content">
              {book.language}
            </div>
          ) : null}
        </div>

        {book.synopsis ? (
          <section className="mt-7">
            <h2 className="font-display text-[20px] font-semibold text-content">
              Sinopse
            </h2>
            <p className="mt-3 text-[13px] leading-[1.65] text-content">
              {book.synopsis}
            </p>
          </section>
        ) : null}

        <div className="my-5 border-b border-dashed border-content-accent-muted/70" />

        <div className="space-y-3">
          {libraryStatus === 'added' ? (
            <Button
              fullWidth
              variant="secondary"
              onClick={() => navigate('/biblioteca')}
            >
              Na biblioteca
            </Button>
          ) : (
            <Button
              fullWidth
              disabled={libraryStatus === 'adding'}
              onClick={() => void addToLibrary()}
            >
              {libraryStatus === 'adding' ? 'Adicionando...' : 'Quero ler'}
            </Button>
          )}

          {libraryStatus === 'error' ? (
            <p role="alert" className="text-center text-xs text-content-muted">
              {libraryError}
            </p>
          ) : null}
        </div>
      </article>
    </div>
  )
}
