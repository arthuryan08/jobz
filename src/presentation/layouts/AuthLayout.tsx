import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-gradient-to-br from-brand-600 via-brand-700 to-brand-950 p-12 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute bottom-12 right-12 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-accent-300/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img src="/wave.svg" alt="" className="h-10 w-10" />
            <span className="text-2xl font-bold tracking-tight">Onda Finance</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Simplifique suas<br />finanças do dia a dia.
          </h2>
          <p className="max-w-sm text-lg text-brand-200 leading-relaxed">
            Transfira, acompanhe e gerencie seu dinheiro em um só lugar, com a segurança que você merece.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold">100%</p>
              <p className="text-sm text-brand-300">Digital</p>
            </div>
            <div>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-brand-300">Taxas ocultas</p>
            </div>
            <div>
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-sm text-brand-300">Disponível</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-brand-400">&copy; 2026 Onda Finance. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 bg-surface-50 transition-colors">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <div className="flex items-center gap-2.5 mb-2">
              <img src="/wave.svg" alt="" className="h-9 w-9" />
              <span className="text-2xl font-bold tracking-tight text-surface-900">Onda Finance</span>
            </div>
            <p className="text-sm text-surface-500">Sua conta digital simplificada</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
