import { Link } from 'react-router-dom'
import {
  ArrowRightLeft, TrendingUp, TrendingDown, Eye, EyeOff, Wallet,
  CreditCard, Search,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { AppLayout } from '@/presentation/layouts'
import { Button, Card, CardContent, Sparkline } from '@/presentation/components/ui'
import { useBalance, useTransactions } from '@/presentation/hooks'
import { useAuthStore } from '@/stores'
import { Money } from '@/domain/value-objects'
import { categoryIconMap } from '@/shared/lib/categories'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

function formatRelativeDate(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays <= 7) return `Há ${diffDays} dias`

  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date)
}

type TxFilter = 'all' | 'credit' | 'debit'

export function Dashboard() {
  const { balanceCents, isLoading: balanceLoading } = useBalance()
  const { data: transactions, isLoading: txLoading } = useTransactions('acc-1')
  const [showBalance, setShowBalance] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<TxFilter>('all')
  const userName = useAuthStore((s) => s.user?.name)

  const formattedBalance = Money.fromCents(balanceCents).format()
  const firstName = userName?.split(' ')[0] ?? 'Usuário'

  // Build sparkline data from transactions (simulate balance history)
  const sparklineData = useMemo(() => {
    if (!transactions || transactions.length === 0) return []
    const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime())
    let running = balanceCents
    // Walk backwards to get starting balance
    for (const tx of [...sorted].reverse()) {
      running += tx.type === 'debit' ? tx.amount.cents : -tx.amount.cents
    }
    // Walk forward to build series
    const points = [running]
    for (const tx of sorted) {
      running += tx.type === 'credit' ? tx.amount.cents : -tx.amount.cents
      points.push(running)
    }
    return points
  }, [transactions, balanceCents])

  // Filtered transactions
  const filteredTx = useMemo(() => {
    if (!transactions) return []
    return transactions.filter((tx) => {
      if (filter !== 'all' && tx.type !== filter) return false
      if (search && !tx.description.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [transactions, filter, search])

  const filterPills: { value: TxFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'credit', label: 'Entradas' },
    { value: 'debit', label: 'Saídas' },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Greeting */}
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm text-surface-500">Acompanhe seu saldo e movimentações</p>
        </div>

        {/* Balance + Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Balance Card */}
          <Card className="animate-fade-in-up delay-75 relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white border-0">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-white/5" />
            <CardContent className="relative z-10 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-brand-200">
                  <Wallet className="h-4 w-4" />
                  Saldo disponível
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="rounded-full p-1.5 text-brand-200 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={showBalance ? 'Ocultar saldo' : 'Mostrar saldo'}
                >
                  {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-3">
                {balanceLoading ? (
                  <div className="h-9 w-40 skeleton-shimmer rounded-lg" />
                ) : (
                  <p className="text-3xl font-bold tracking-tight">
                    {showBalance ? formattedBalance : 'R$ ••••••'}
                  </p>
                )}
              </div>
              <p className="mt-1 text-sm text-brand-300">Conta corrente</p>

              {/* Sparkline chart */}
              {sparklineData.length > 1 && (
                <div className="mt-4 -mx-2">
                  <Sparkline data={sparklineData} width={280} height={48} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="animate-fade-in-up delay-150">
            <CardContent className="flex flex-col justify-center gap-3 p-6">
              <p className="text-sm font-medium text-surface-500">Ações rápidas</p>
              <Button asChild size="lg" className="w-full">
                <Link to="/transfer">
                  <ArrowRightLeft className="h-4 w-4" />
                  Nova Transferência
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full" disabled>
                <Wallet className="h-4 w-4" />
                Pagar boleto
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <Card className="animate-fade-in-up delay-200">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-base font-semibold tracking-[-0.01em] text-surface-900">
                Últimas transações
              </h2>
              <span className="text-xs font-medium text-surface-400">
                {filteredTx.length} registros
              </span>
            </div>

            {/* Search + Filter */}
            <div className="border-t border-surface-100 px-6 py-3 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  placeholder="Buscar transação..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-full rounded-lg border border-surface-200 bg-elevated pl-9 pr-3 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </div>
              <div className="flex gap-2">
                {filterPills.map((pill) => (
                  <button
                    key={pill.value}
                    onClick={() => setFilter(pill.value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      filter === pill.value
                        ? 'bg-brand-600 text-white'
                        : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-surface-100">
              {txLoading ? (
                <div className="space-y-px">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4">
                      <div className="h-10 w-10 skeleton-shimmer rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 skeleton-shimmer rounded" />
                        <div className="h-3 w-20 skeleton-shimmer rounded" />
                      </div>
                      <div className="h-4 w-24 skeleton-shimmer rounded" />
                    </div>
                  ))}
                </div>
              ) : filteredTx.length > 0 ? (
                <ul role="list">
                  {filteredTx.map((tx, index) => {
                    const isCredit = tx.type === 'credit'
                    const CategoryIcon = categoryIconMap[tx.description] ?? CreditCard
                    return (
                      <li
                        key={tx.id.value}
                        className="animate-fade-in-up flex items-center gap-4 border-b border-surface-50 px-6 py-3.5 last:border-0 transition-colors hover:bg-surface-50/50"
                        style={{ animationDelay: `${(index + 1) * 50}ms` }}
                      >
                        {/* Icon */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isCredit
                              ? 'bg-success-50 text-success-600'
                              : 'bg-danger-50 text-danger-500'
                          }`}
                        >
                          <CategoryIcon className="h-[18px] w-[18px]" />
                        </div>

                        {/* Description */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-surface-900">
                            {tx.description}
                          </p>
                          <p className="text-xs text-surface-400">
                            {formatRelativeDate(tx.date)}
                          </p>
                        </div>

                        {/* Amount */}
                        <span
                          className={`text-sm font-semibold tabular-nums ${
                            isCredit ? 'text-success-600' : 'text-danger-600'
                          }`}
                        >
                          {isCredit ? '+ ' : '- '}
                          {tx.amount.format()}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <div className="rounded-xl bg-surface-100 p-3">
                    <ArrowRightLeft className="h-6 w-6 text-surface-400" />
                  </div>
                  <p className="text-sm text-surface-500">
                    {search || filter !== 'all'
                      ? 'Nenhuma transação encontrada com os filtros aplicados.'
                      : 'Nenhuma transação encontrada.'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
