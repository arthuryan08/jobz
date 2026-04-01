import { CheckCircle, Copy, Share2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from './button'
import { categoryIconMap } from '@/shared/lib/categories'
import { cn } from '@/shared/lib/utils'

interface ReceiptProps {
  category: string
  description?: string
  amount: string
  newBalance: string
  date: Date
  transactionId: string
  onNewTransfer: () => void
  onGoBack: () => void
}

export function Receipt({
  category,
  description,
  amount,
  newBalance,
  date,
  transactionId,
  onNewTransfer,
  onGoBack,
}: ReceiptProps) {
  const [copied, setCopied] = useState(false)
  const CategoryIcon = categoryIconMap[category]

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

  const receiptText = [
    '── Comprovante Onda Finance ──',
    `Data: ${formattedDate}`,
    `Categoria: ${category}`,
    description ? `Descrição: ${description}` : null,
    `Valor: ${amount}`,
    `Novo saldo: ${newBalance}`,
    `ID: ${transactionId}`,
    '──────────────────────',
  ].filter(Boolean).join('\n')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(receiptText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const canShare = typeof navigator.share === 'function'

  const handleShare = async () => {
    try {
      await navigator.share({ title: 'Comprovante de Transferência', text: receiptText })
    } catch {
      // cancelled
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4 animate-scale-in">
      {/* Success icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-50">
        <CheckCircle className="h-8 w-8 text-success-500" />
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-surface-900">Transferência realizada!</p>
        <p className="mt-1 text-sm text-surface-500">{formattedDate}</p>
      </div>

      {/* Receipt card */}
      <div className="w-full rounded-xl border border-surface-200 bg-surface-50 p-5">
        <div className="space-y-4">
          {/* Category */}
          <div className="flex items-center gap-3">
            {CategoryIcon && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger-50 text-danger-500">
                <CategoryIcon className="h-[18px] w-[18px]" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-surface-900">{category}</p>
              {description && (
                <p className="text-xs text-surface-500">{description}</p>
              )}
            </div>
          </div>

          <div className="border-t border-dashed border-surface-300" />

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-500">Valor</span>
              <span className="text-sm font-semibold text-danger-600">- {amount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-500">Novo saldo</span>
              <span className="text-sm font-semibold text-surface-900">{newBalance}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-surface-300" />

          <p className="text-center text-[11px] font-medium tracking-wider text-surface-400 uppercase">
            ID {transactionId.slice(0, 8)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex w-full gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleCopy}
        >
          <Copy className={cn('h-3.5 w-3.5', copied && 'text-success-500')} />
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
        {canShare && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleShare}
          >
            <Share2 className="h-3.5 w-3.5" />
            Compartilhar
          </Button>
        )}
      </div>

      <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
        <Button onClick={onNewTransfer} variant="outline" className="sm:w-auto">
          Nova transferência
        </Button>
        <Button onClick={onGoBack} className="sm:w-auto">
          Voltar ao Dashboard
        </Button>
      </div>
    </div>
  )
}
