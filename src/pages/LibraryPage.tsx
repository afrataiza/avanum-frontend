import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, FeedbackState } from '@/components/ui'
import { libraryApi } from '@/lib/api'
import type { UserBook } from '@/lib/api'

type LibraryTab = 'all' | 'reading' | 'completed' | 'want_to_read' | 'more'
type ExtraStatus = 'paused' | 'abandoned'
type LibraryStatus = 'reading' | 'paused' | 'abandoned' | 'completed' | 'want_to_read'

const tabs: { id: LibraryTab; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'reading', label: 'Lendo' },
  { id: 'completed', label: 'Concluídos' },
  { id: 'want_to_read', label: 'Quero Ler' },
  { id: 'more', label: 'Mais' },
]

const statusLabels: Record<LibraryStatus, string> = {
  reading: 'Lendo',
  paused: 'Pausado',
  abandoned: 'Interrompido',
  completed: 'Lido ✓',
  want_to_read: 'Novo',
}

function getLibraryStatus(userBook: UserBook): LibraryStatus {
  const status = userBook.reading?.status ?? userBook.status

  if (
    status === 'reading' ||
    status === 'paused' ||
    status === 'abandoned' ||
    status === 'completed' ||
    status === 'want_to_read'
  ) {
    return status
  }

  return 'want_to_read'
}

function BookCard({ userBook, onOpen }: { userBook: UserBook; onOpen: () => void }) {
  const status = getLibraryStatus(userBook)
  const reading = userBook.reading
  const progress =
    reading && reading.totalUnits > 0
      ? Math.min(100, Math.round((reading.currentUnits / reading.totalUnits) * 100))
      : null

  const badgeClass =
    status === 'reading'
      ? 'border-sky-200 bg-sky-100 text-sky-900'
      : status === 'completed'
        ? 'border-emerald-200 bg-emerald-100 text-emerald-900'
        : status === 'paused'
          ? 'border-amber-200 bg-amber-100 text-amber-900'
          : 'border-border bg-surface-muted text-content-muted'

  const showBadge = status !== 'want_to_read'
  const badgeLabel =
    status === 'reading'
      ? progress !== null
        ? `${progress}% lido`
        : 'Leitura em andamento'
      : status === 'completed'
        ? 'Concluído'
        : status === 'paused'
          ? 'Pausado'
          : 'Interrompido'

  return (
    <button
      type="button"
      onClick={onOpen}
      className="focus-ring block min-w-0 w-full rounded-lg text-left"
      aria-label={`Abrir ${userBook.book.title}`}
    >
      <div className="min-w-0">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-surface-muted">
          {userBook.book.coverUrl ? (
            <img
              src={userBook.book.coverUrl}
              alt={`Capa de ${userBook.book.title}`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-3 text-center font-display text-sm font-semibold text-content-muted">
              {userBook.book.title}
            </div>
          )}
          {showBadge && (
            <span
              title={badgeLabel}
              aria-label={badgeLabel}
              className={`absolute right-2 top-2 inline-flex items-center justify-center rounded-md border p-1.5 shadow-sm ${badgeClass}`}
            >
              {status === 'reading' && progress !== null ? (
                <span className="px-0.5 text-[10px] font-bold leading-none">{progress}%</span>
              ) : status === 'completed' ? (
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
                  <path d="m3 8 3.2 3.2L13 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : status === 'paused' ? (
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
                  <rect x="3" y="2.5" width="3.5" height="11" rx="1" />
                  <rect x="9.5" y="2.5" width="3.5" height="11" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
                  <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              )}
            </span>
          )}
        </div>

        <div className="min-w-0 pt-3">
          <h2 className="line-clamp-2 font-display text-[17px] font-semibold leading-[1.05] text-content">
            {userBook.book.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-[12px] leading-4 text-content-muted">
            {userBook.book.authors.join(', ') || 'Autor desconhecido'}
          </p>
        </div>
      </div>
    </button>
  )
}

function LibraryLoading() {
  return (
    <div className="space-y-4 px-6 pb-8 pt-6" aria-label="Carregando biblioteca" aria-busy="true">
      <div className="h-8 w-44 animate-pulse rounded-md bg-surface-muted" />
      <div className="h-16 animate-pulse rounded-xl bg-surface-muted" />
      <div className="grid grid-cols-2 gap-5">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-56 animate-pulse rounded-2xl border border-border bg-surface-elevated"
          />
        ))}
      </div>
    </div>
  )
}

export function LibraryPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<UserBook[]>([])
  const [loadStatus, setLoadStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [retryKey, setRetryKey] = useState(0)
  const [activeTab, setActiveTab] = useState<LibraryTab>('all')
  const [extraStatus, setExtraStatus] = useState<ExtraStatus>('paused')

  useEffect(() => {
    let active = true

    libraryApi
      .list()
      .then((nextItems) => {
        if (!active) return
        setItems(nextItems)
        setLoadStatus('success')
      })
      .catch(() => {
        if (active) setLoadStatus('error')
      })

    return () => {
      active = false
    }
  }, [retryKey])

  const counts = useMemo(() => {
    const countByStatus = (status: LibraryStatus) =>
      items.filter((item) => getLibraryStatus(item) === status).length

    return {
      total: items.length,
      reading: countByStatus('reading'),
      completed: countByStatus('completed'),
    }
  }, [items])

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return items

    if (activeTab === 'more') {
      return items.filter((item) => getLibraryStatus(item) === extraStatus)
    }

    return items.filter((item) => getLibraryStatus(item) === activeTab)
  }, [activeTab, extraStatus, items])

  if (loadStatus === 'loading') return <LibraryLoading />

  if (loadStatus === 'error') {
    return (
      <div className="px-6 py-12">
        <FeedbackState
          title="Não conseguimos carregar sua biblioteca"
          description="Confira sua conexão e tente novamente."
          action={
            <Button
              onClick={() => {
                setLoadStatus('loading')
                setRetryKey((value) => value + 1)
              }}
            >
              Tentar novamente
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="pb-8 pt-6">
      <div className="sticky top-0 z-10 bg-surface pb-1">
      <header className="space-y-3 px-6 pt-6">
        <h1 className="font-display text-[28px] font-semibold leading-tight text-content">
          Sua Biblioteca
        </h1>

        <section
          aria-label="Estatísticas da biblioteca"
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-elevated p-3.5"
        >
          <div className="min-w-0">
            <p className="text-[10px] uppercase text-content-muted">Total</p>
            <p className="mt-0.5 font-display text-lg font-bold text-accent">
              {counts.total} {counts.total === 1 ? 'livro' : 'livros'}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase text-content-muted">Lendo</p>
            <p className="mt-0.5 font-display text-lg font-bold text-content-accent-muted">
              {counts.reading} ativos
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase text-content-muted">Concluídos</p>
            <p className="mt-0.5 font-display text-lg font-bold text-[#a76d58]">
              {counts.completed} lidos
            </p>
          </div>
        </section>
      </header>

      <div
        role="tablist"
        aria-label="Filtrar biblioteca"
        className="mt-6 flex gap-5 overflow-x-auto border-b border-border px-6"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'focus-ring shrink-0 border-b-2 pb-2 text-sm transition-colors',
                isActive
                  ? 'border-accent font-bold text-accent'
                  : 'border-transparent font-medium text-content-muted hover:text-content',
              ].join(' ')}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      </div>

      {activeTab === 'more' ? (
        <div className="flex gap-2 px-6 pt-4" aria-label="Outros status">
          {(
            [
              { id: 'paused', label: 'Pausados' },
              { id: 'abandoned', label: 'Interrompidos' },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={extraStatus === option.id}
              onClick={() => setExtraStatus(option.id)}
              className={[
                'focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                extraStatus === option.id
                  ? 'border-accent bg-surface-muted text-accent'
                  : 'border-border text-content-muted',
              ].join(' ')}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      <section className="px-6 pt-6" aria-label={tabs.find((tab) => tab.id === activeTab)?.label}>
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 items-start gap-5">
            {filteredItems.map((userBook) => (
              <BookCard
                key={userBook.id}
                userBook={userBook}
                onOpen={() => navigate(`/explorar/livro/${encodeURIComponent(userBook.book.id)}`)}
              />
            ))}
          </div>
        ) : (
          <FeedbackState
            title={
              activeTab === 'all'
                ? 'Sua biblioteca está vazia'
                : activeTab === 'reading'
                ? 'Nenhuma leitura em andamento'
                : activeTab === 'completed'
                  ? 'Suas próximas conquistas começam aqui'
                  : activeTab === 'want_to_read'
                    ? 'Sua lista está esperando por você'
                    : extraStatus === 'paused'
                      ? 'Nenhuma leitura pausada'
                      : 'Nenhum livro interrompido'
            }
            description={
              activeTab === 'all'
                ? 'Explore o catálogo e adicione livros para montar sua estante.'
                : activeTab === 'reading'
                ? 'Escolha um livro da biblioteca e comece a explorar novas histórias.'
                : activeTab === 'completed'
                  ? 'Quando concluir uma leitura, ela aparecerá nesta estante.'
                  : activeTab === 'want_to_read'
                    ? 'Explore o catálogo e salve os livros que deseja ler depois.'
                    : extraStatus === 'paused'
                      ? 'As leituras pausadas aparecerão aqui.'
                      : 'Os livros que você interromper aparecerão aqui.'
            }
            action={
              <Button variant="secondary" onClick={() => navigate('/explorar')}>
                Explorar livros
              </Button>
            }
          />
        )}
      </section>
    </div>
  )
}
