import {
  Badge,
  Button,
  Card,
  Divider,
  EloraMessage,
  FeedbackState,
  Input,
  Progress,
} from '@/components/ui'

export function App() {
  return (
    <main className="min-h-dvh bg-surface text-content">
      <section className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-6 py-8">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">Avanum</p>
          <h1 className="mt-1 font-display text-[32px] font-semibold leading-tight">
            Design System
          </h1>
          <p className="mt-2 text-sm leading-5 text-content-muted">
            Preview das primitivas visuais definidas a partir do baseline do Figma.
          </p>
        </header>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-content-accent-muted">
                Progresso
              </p>
              <p className="mt-1 font-display text-[22px] font-semibold">A jornada começa</p>
            </div>
            <Badge>XP 240</Badge>
          </div>

          <Progress className="mt-4" value={72} label="Nível atual" showValue size="md" />
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-accent">Controles</p>
            <p className="mt-1 text-sm text-content-muted">Componentes funcionais reutilizáveis.</p>
          </div>

          <Input label="Buscar" placeholder="Digite um livro ou autor" />

          <div className="flex gap-3">
            <Button>Continuar</Button>
            <Button className="border-border bg-surface-muted text-content hover:opacity-90">
              Secundário
            </Button>
          </div>
        </Card>

        <EloraMessage>
          Cada componente deve manter a linguagem visual do Avanum sem criar uma nova variação por
          tela.
        </EloraMessage>

        <Divider />

        <FeedbackState
          title="Nenhuma descoberta ainda"
          description="Quando uma nova conquista acontecer, ela aparecerá aqui."
          action={<Button>Explorar livros</Button>}
        />
      </section>
    </main>
  )
}
