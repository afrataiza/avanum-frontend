import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { achievementsApi, expeditionsApi, libraryApi, xpApi } from '@/lib/api'
import type { UserAchievement, UserBook, UserExpedition, XPBalance } from '@/lib/api'
import { Avatar, Badge, Button, Card, EloraMessage, FeedbackState, Progress } from '@/components/ui'

function getFirstName(user: ReturnType<typeof useAuth>['user']) {
  const name =
    user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? 'Leitor'
  return name.trim().split(/\s+/)[0] || 'Leitor'
}

function formatObjective(expedition: UserExpedition) {
  const objective = expedition.expedition.objectiveType
  if (objective === 'pages_read') return 'páginas'
  if (objective === 'minutes_listened') return 'minutos'
  return 'livros'
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-3 font-display text-[21px] font-semibold leading-tight text-content">
      {children}
    </h2>
  )
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

  return (
    <Card>
      <div className="flex gap-4">
        <div className="h-28 w-20 shrink-0 overflow-hidden bg-surface-muted">
          {userBook.book.coverUrl ? (
            <img src={userBook.book.coverUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-2 text-center font-display text-sm text-content-muted">
              Sem capa
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
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
        onClick={() => navigate('/leitura')}
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
    <Card compact className="min-h-24 text-center">
      <div className="mx-auto flex size-8 items-center justify-center rounded-full bg-surface-muted text-accent">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
          <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="m14.8 9.2-2.1 4.2-4.2 2.1 2.1-4.2 4.2-2.1Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <h3 className="mt-2 text-[11px] font-bold leading-tight text-content">
        {achievement.achievement.name}
      </h3>
    </Card>
  )
}

export function JourneyPage() {
  const { user } = useAuth()
  const [library, setLibrary] = useState<UserBook[]>([])
  const [expeditions, setExpeditions] = useState<UserExpedition[]>([])
  const [achievements, setAchievements] = useState<UserAchievement[]>([])
  const [xpBalance, setXpBalance] = useState<XPBalance | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    Promise.all([
      libraryApi.list(),
      expeditionsApi.listMine(),
      achievementsApi.listMine(),
      xpApi.getMine(),
    ])
      .then(([nextLibrary, nextExpeditions, nextAchievements, nextXp]) => {
        if (!active) return
        setLibrary(nextLibrary)
        setExpeditions(nextExpeditions)
        setAchievements(nextAchievements)
        setXpBalance(nextXp.balance)
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
    () =>
      library.find(
        (item) => item.reading?.status === 'reading' || item.reading?.status === 'paused',
      ),
    [library],
  )

  const activeExpedition = useMemo(
    () => expeditions.find((item) => item.status === 'active' && item.expedition.active),
    [expeditions],
  )

  const recentDiscoveries = useMemo(
    () => [...achievements].sort((a, b) => b.achievedAt.localeCompare(a.achievedAt)).slice(0, 2),
    [achievements],
  )

  if (isLoading) return <JourneyLoading />

  if (error) {
    return (
      <div className="px-6 py-12">
        <FeedbackState
          title="Não conseguimos carregar sua jornada"
          description="Tente novamente em alguns instantes."
          action={<Button onClick={() => window.location.reload()}>Tentar novamente</Button>}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 px-6 pb-8 pt-6">
      <header className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar src={user?.user_metadata?.avatar_url} alt="" size="user" />
            <div>
              <p className="text-[13px] text-content-muted">Olá,</p>
              <h1 className="font-display text-[22px] font-semibold leading-none text-content">
                {getFirstName(user)}
              </h1>
            </div>
          </div>

          <div className="rounded-md border border-border bg-surface-elevated px-3 py-2 text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-accent">
              Nível {xpBalance?.level ?? 1}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-content-accent-muted">
              {xpBalance?.levelName ?? 'Aprendiz'}
            </p>
            <p className="text-[12px] font-bold text-accent">
              {(xpBalance?.totalXp ?? 0).toLocaleString('pt-BR')}/
              {(xpBalance?.levelXpRequired ?? 0).toLocaleString('pt-BR')} XP
            </p>
          </div>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-pill bg-surface-muted"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-pill bg-accent"
              style={{ width: `${xpBalance?.levelProgress ?? 0}%` }}
            />
          </div>
        </div>
      </header>

      <section>
        <SectionTitle>Leitura Atual</SectionTitle>
        {activeReading ? (
          <ActiveReadingCard userBook={activeReading} />
        ) : (
          <Card>
            <p className="text-[11px] font-bold uppercase tracking-wide text-accent">Sua jornada</p>
            <h2 className="mt-1 font-display text-[22px] font-semibold text-content">
              Pronto para começar uma nova leitura?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-content-muted">
              Explore o catálogo ou escolha um livro da sua biblioteca para iniciar sua próxima
              aventura.
            </p>
          </Card>
        )}
      </section>

      {activeExpedition ? (
        <section>
          <SectionTitle>Próxima Expedição</SectionTitle>
          <ExpeditionCard expedition={activeExpedition} />
        </section>
      ) : null}

      {recentDiscoveries.length > 0 ? (
        <section>
          <SectionTitle>Descobertas Recentes</SectionTitle>

          <div className="grid grid-cols-3 gap-3">
            {recentDiscoveries.slice(0, 3).map((achievement) => (
              <DiscoveryCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </section>
      ) : null}

      <EloraMessage tip>
        Já experimentou ler ao ar livre? Muda completamente a experiência!
      </EloraMessage>
    </div>
  )
}
