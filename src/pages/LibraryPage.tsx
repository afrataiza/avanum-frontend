import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, FeedbackState } from '@/components/ui'
import { libraryApi } from '@/lib/api'
import type { UserBook } from '@/lib/api'

type LibraryTab = 'reading' | 'completed' | 'want_to_read' | 'more'
type ExtraStatus = 'paused' | 'abandoned'
type LibraryStatus = 'reading' | 'paused' | 'abandoned' | 'completed' | 'want_to_read'

const tabs: { id: LibraryTab; label: string }[] = [
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

  const tagClass =
    status === 'completed'
      ? 'bg-[#a76d58]'
      : status === 'want_to_read'
        ? 'bg-accent text-surface'
        : status === 'reading'
          ? 'bg-[#a76d58]'
          : 'bg-surface-muted'

  return (
    <button
      type="button"
      onClick={onOpen}
      className="focus-ring block min-w-0 w-full rounded-2xl text-left"
      aria-label={`Abrir ${userBook.book.title}`}
    >
      <Card className="h-full rounded-2xl p-3 transition-colors hover:border-accent-border">
        <div className="relative flex h-[104px] w-[72px] flex-col justify-between overflow-hidden rounded-lg border border-accent-border bg-surface-muted p-2">
          {userBook.book.coverUrl ? (
            <img
              src={userBook.book.coverUrl}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-muted p-1 text-center font-display text-xs font-semibold text-content-muted">
              {userBook.book.title}
            </div>
          )}
          <div className="absolute inset-0 bg-black/20" />
          {status !== 'want_to_read' || progress === null ? (
            <span
              className={`relative z-10 -ml-1 -mt-1 w-fit max-w-full truncate rounded px-1.5 py-0.5 text-[8px] font-bold ${status === 'want_to_read' ? 'text-surface' : 'text-content'} ${tagClass}`}
            >
              {status === 'reading' && progress !== null ? `${progress}%` : statusLabels[status]}
            </span>
          ) : (
            <span className="relative z-10 -ml-1 -mt-1 w-fit rounded bg-accent px-1.5 py-0.5 text-[8px] font-bold text-surface">
              Novo
            </span>
          )}
          <div className="relative z-10 mt-auto min-w-0">
            <p className="line-clamp-2 font-display text-[9px] font-semibold leading-tight text-content">
              {userBook.book.title}
            </p>
            <p className="mt-0.5 truncate text-[7px] text-accent">
              {userBook.book.authors.join(', ') || 'Autor desconhecido'}
            </p>
          </div>
        </div>

        <div className="mt-3 min-w-0">
          <h2 className="line-clamp-2 font-display text-[15px] font-semibold leading-tight text-content">
            {userBook.book.title}
          </h2>
          <p className="mt-1 truncate text-xs text-content-muted">
            {userBook.book.authors.join(', ') || 'Autor desconhecido'}
          </p>
          {status === 'reading' && reading ? (
            <div className="mt-3">
              <div className="h-1 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${progress ?? 0}%` }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-content-muted">
                {reading.currentUnits} de {reading.totalUnits} unidades
              </p>
            </div>
          ) : null}
        </div>
      </Card>
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
  const [activeTab, setActiveTab] = useState<LibraryTab>('reading')
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
            <Button onClick={() => { setStatus('loading'); setRetryKey((value) => value + 1) }}>Tentar novamente</Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="pb-8 pt-6">
      <header className="space-y-3 px-6">
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
              activeTab === 'reading'
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
              activeTab === 'reading'
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
