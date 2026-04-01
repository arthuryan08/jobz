import { type ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, LayoutDashboard, ArrowRightLeft, Sun, Moon, Monitor } from 'lucide-react'
import { useAuthStore, useThemeStore } from '@/stores'
import { Button } from '@/presentation/components/ui'

interface AppLayoutProps {
  children: ReactNode
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transfer', label: 'Transferir', icon: ArrowRightLeft },
]

const themeIcons = { light: Sun, dark: Moon, system: Monitor } as const
const themeOrder = ['light', 'dark', 'system'] as const

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useThemeStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const cycleTheme = () => {
    const idx = themeOrder.indexOf(theme)
    setTheme(themeOrder[(idx + 1) % themeOrder.length])
  }

  const ThemeIcon = themeIcons[theme]

  return (
    <div className="min-h-dvh bg-surface-50 pb-16 sm:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-surface-200/80 bg-elevated/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/dashboard" className="flex items-center gap-0.5">
            <img src="/wave.svg" alt="" className="h-8 w-8" />
            <span className="text-[22px] font-bold tracking-tight text-surface-900">
              Onda <span className="text-brand-600">Finance</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={cycleTheme}
              aria-label={`Tema: ${theme}`}
              title={`Tema: ${theme}`}
            >
              <ThemeIcon className="h-4 w-4" />
            </Button>

            {/* Avatar chip */}
            <div className="flex items-center gap-3 rounded-full bg-surface-100 py-1.5 pl-1.5 pr-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                {user?.name?.charAt(0) ?? 'U'}
              </div>
              <span className="hidden text-sm font-medium text-surface-700 sm:inline">
                {user?.name}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sair">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Desktop Navigation */}
      <nav className="hidden border-b border-surface-200/80 bg-elevated sm:block">
        <div className="mx-auto flex max-w-6xl px-6">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-brand-600'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-600" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-200/80 bg-elevated/90 backdrop-blur-lg sm:hidden">
        <div className="flex items-stretch justify-around">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                  isActive
                    ? 'text-brand-600'
                    : 'text-surface-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
