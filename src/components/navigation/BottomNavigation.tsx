import { NavLink } from 'react-router-dom'

type NavigationIconProps = {
  className?: string
}

function CompassIcon({ className = '' }: NavigationIconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m14.8 9.2-1.9 3.7-3.7 1.9 1.9-3.7 3.7-1.9Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function SearchIcon({ className = '' }: NavigationIconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.5" />
      <path d="m15.5 15.5 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  )
}

function BookIcon({ className = '' }: NavigationIconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M5.5 5.5c2.5-.9 4.6-.5 6.5 1v12c-1.9-1.5-4-1.9-6.5-1V5.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M18.5 5.5c-2.5-.9-4.6-.5-6.5 1v12c1.9-1.5 4-1.9 6.5-1V5.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function GlobeIcon({ className = '' }: NavigationIconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.8 12h16.4M12 3.5c2.1 2.2 3.1 5 3.1 8.5s-1 6.3-3.1 8.5c-2.1-2.2-3.1-5-3.1-8.5s1-6.3 3.1-8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

const navigationItems = [
  { to: '/', label: 'Jornada', icon: CompassIcon },
  { to: '/explorar', label: 'Explorar', icon: SearchIcon },
  { to: '/biblioteca', label: 'Biblioteca', icon: BookIcon },
  { to: '/mapa', label: 'Mapa', icon: GlobeIcon },
] as const

export function BottomNavigation() {
  return (
    <nav
      aria-label="Navegação principal"
      className="shrink-0 border-t border-border bg-surface pb-[max(8px,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto flex h-[68px] w-full max-w-md items-start justify-around">
        {navigationItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'focus-ring flex h-full w-1/4 flex-col items-center justify-start gap-1 pt-2.5',
                'text-[11px] leading-none transition-colors',
                isActive ? 'font-bold text-accent' : 'font-medium text-content-muted',
              ].join(' ')
            }
          >
            <Icon className="size-[22px]" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
      <div aria-hidden="true" className="mx-auto h-1 w-[134px] rounded-pill bg-content-muted" />
    </nav>
  )
}
