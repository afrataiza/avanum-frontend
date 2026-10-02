import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { achievementsApi, expeditionsApi, libraryApi } from '@/lib/api'
import type { UserAchievement, UserBook, UserExpedition } from '@/lib/api'
import { Avatar, Badge, Button, Card, EloraMessage, FeedbackState, Progress } from '@/components/ui'

function getFirstName(user: ReturnType<typeof useAuth>['user']) {
  const name = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? 'Leitor'
  return name.trim().split(/\s+/)[0] || 'Leitor'
}

function formatObjective(expedition: UserExpedition) {
  const objective = expedition.expedition.objectiveType
  if (objective === 'pages_read') return 'páginas'
  if (objective === 'minutes_listened') return 'minutos'
  return 'livros'
}

function JourneyLoading() {
  return (
    <div className="space-y-4 px-6 py-6" aria-busy="true">
      <div className="h-8 w-40 animate-pulse rounded-md bg-surface-muted" />
      <div className="h-20 animate-pulse rounded-lg bg-surface-muted" />
      <div className="h-44 animate-pulse rounded-lg bg-surface-muted" />
      <div className="h-28 animate-pulse rounded-lg bg-surface-muted" />
    </div>
  )
}

function ActiveReadingCard({ userBook }: { userBook: UserBook }) {
  const navigate = useNavigate()
  const reading = userBook.reading

  if (!reading) return null

  const percentage = reading.totalUnits > 0 ? (reading.currentUnits / reading.totalUnits) * 100 : 0

  return (
    <Card>
      <div className="flex gap-4">
        <div className="h-28 w-20 shrink-0 overflow-hidden rounded-md bg-surface-muted">
          {userBook.book.coverUrl ? (
            <img
              src={userBook.book.coverUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-2 text-center font-display text-sm text-content-muted">
              Sem capa
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wide text-accent">Em leitura</p>
          <h2 className="mt-1 font-display text-[22px] font-semibold leading-tight text-content">
            {userBook.book.title}
          </h2>
          <p className="mt-1 truncate text-xs text-content-muted">
            {userBook.book.authors.join(', ') || 'Autor não informado'}
          </p>

          <div className="mt-4">
            <Progress value={reading.currentUnits} max={reading.totalUnits} showValue />
            <p className="mt-1.5 text-[11px] text-content-muted">
              {reading.currentUnits} de {reading.totalUnits} unidades
            </p>
          </div>
        </div>
      </div>

      <Button
        fullWidth
        className="mt-4"
        onClick={() => navigate('/biblioteca')}
        aria-label={'Continuar leitura de ' + userBook.book.title}
      >
        Continuar leitura
      </Button>
    </Card>
  )
}

function ExpeditionCard({ expedition }: { expedition: UserExpedition }) {
  const target = expedition.expedition.targetValue
  const value = Math.min(target, expedition.currentValue)
  const percentage = target > 0 ? (value / target) * 100 : 0

  return (
    <Card compact>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-accent">
            Próximo objetivo
          </p>
          <h2 className="mt-1 font-display text-[20px] font-semibold text-content">
            {expedition.expedition.name}
          </h2>
        </div>
        <Badge>{Math.round(percentage)}%</Badge>
      </div>

      {expedition.expedition.description ? (
        <p className="mt-2 text-[12px] leading-relaxed text-content-muted">
          {expedition.expedition.description}
        </p>
      ) : null}

      <div className="mt-3">
        <Progress value={value} max={target} />
        <p className="mt-1.5 text-[11px] text-content-muted">
          {value} de {target} {formatObjective(expedition)}
        </p>
      </div>
    </Card>
  )
}

function DiscoveryCard({ achievement }: { achievement: UserAchievement }) {
  return (
    <Card compact>
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-accent">
        Descoberta recente
      </p>
      <h2 className="mt-1 font-display text-[19px] font-semibold text-content">
        {achievement.achievement.name}
      </h2>
      <p className="mt-1 text-[12px] leading-relaxed text-content-muted">
        {achievement.achievement.description}
      </p>
    </Card>
  )
}

export function JourneyPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [library, setLibrary] = useState<UserBook[]>([])
  const [expeditions, setExpeditions] = useState<UserExpedition[]>([])
  const [achievements, setAchievements] = useState<UserAchievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    Promise.all([
      libraryApi.list(),
      expeditionsApi.listMine(),
      achievementsApi.listMine(),
    ])
      .then(([nextLibrary, nextExpeditions, nextAchievements]) => {
        if (!active) return
        setLibrary(nextLibrary)
        setExpeditions(nextExpeditions)
        setAchievements(nextAchievements)
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const activeReading = useMemo(
    () => library.find((item) => item.reading?.status === 'reading' || item.reading?.status === 'paused'),
    [library],
  )

  const activeExpedition = useMemo(
    () => expeditions.find((item) => item.status === 'active' && item.expedition.active),
    [expeditions],
  )

  const recentDiscoveries = useMemo(
    () =>
      [...achievements]
        .sort((a, b) => b.achievedAt.localeCompare(a.achievedAt))
        .slice(0, 2),
    [achievements],
  )

  if (isLoading) return <JourneyLoading />

  if (error) {
    return (
      <div className="px-6 py-12">
        <FeedbackState
          title="Não conseguimos carregar sua jornada"
          description="Tente novamente em alguns instantes."
          action={
            <Button onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 px-6 pb-8 pt-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-accent">Jornada</p>
          <h1 className="mt-1 font-display text-[28px] font-semibold leading-none text-content">
            Olá, {getFirstName(user)}
          </h1>
        </div>

        <Avatar
          src={user?.user_metadata?.avatar_url}
          alt=""
          size="user"
        />
      </header>

      <EloraMessage>
        Continue sua aventura. Cada página lida é um novo passo na sua jornada.
      </EloraMessage>

      {activeReading ? (
        <ActiveReadingCard userBook={activeReading} />
      ) : (
        <Card>
          <p className="text-[11px] font-bold uppercase tracking-wide text-accent">Sua jornada</p>
          <h2 className="mt-1 font-display text-[22px] font-semibold text-content">
            Pronto para começar uma nova leitura?
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-content-muted">
            Explore o catálogo ou escolha um livro da sua biblioteca para iniciar sua próxima aventura.
          </p>
          <div className="mt-4 flex gap-3">
            <Button className="flex-1" onClick={() => navigate('/explorar')}>
              Explorar livros
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => navigate('/biblioteca')}>
              Biblioteca
            </Button>
          </div>
        </Card>
      )}

      {activeExpedition ? <ExpeditionCard expedition={activeExpedition} /> : null}

      {recentDiscoveries.length > 0 ? (
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-accent">Descobertas</p>
              <h2 className="mt-1 font-display text-[22px] font-semibold text-content">
                Recentes
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {recentDiscoveries.map((achievement) => (
              <DiscoveryCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={() => navigate('/explorar')}>
          Explorar
        </Button>
        <Button variant="secondary" onClick={() => navigate('/biblioteca')}>
          Biblioteca
        </Button>
      </div>
    </div>
  )
}
