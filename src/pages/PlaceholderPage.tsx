import { useLocation } from 'react-router-dom'
import { FeedbackState } from '@/components/ui'

const titles: Record<string, string> = {
  '/': 'Jornada',
  '/explorar': 'Explorar',
  '/biblioteca': 'Biblioteca',
  '/mapa': 'Mapa',
}

export function PlaceholderPage() {
  const { pathname } = useLocation()
  const title = pathname.startsWith('/leitura/iniciar/')
    ? 'Iniciar leitura'
    : titles[pathname] ?? 'Avanum'

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-12">
      <FeedbackState
        title={title}
        description="Esta área será implementada na próxima etapa do frontend."
      />
    </div>
  )
}
