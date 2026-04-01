import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/presentation/components/ui'

export function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface-50 px-6 text-center">
      <div className="animate-fade-in-up">
        <img src="/wave.svg" alt="" className="mx-auto mb-8 h-16 w-16 opacity-30" />
        <p className="text-8xl font-bold tracking-tighter text-brand-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-surface-900">
          Página não encontrada
        </h1>
        <p className="mt-2 text-surface-500">
          A página que você procura não existe ou foi movida.
        </p>
        <Button asChild className="mt-8">
          <Link to="/dashboard">
            <Home className="h-4 w-4" />
            Voltar ao início
          </Link>
        </Button>
      </div>
    </div>
  )
}
