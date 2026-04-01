import { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AppLayout } from '@/presentation/layouts'
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  ConfirmDialog,
  toast,
  CategorySelect,
  Receipt,
} from '@/presentation/components/ui'
import { CurrencyInput } from '@/presentation/components/ui/currency-input'
import { useBalance, useTransfer } from '@/presentation/hooks'
import { transferSchema, type TransferFormData } from '@/shared/schemas/transferSchema'
import { Money } from '@/domain/value-objects'
import { InsufficientBalanceError } from '@/domain/errors'

interface ReceiptData {
  category: string
  description?: string
  amount: string
  newBalance: string
  transactionId: string
  date: Date
}

export function Transfer() {
  const { balanceCents } = useBalance()
  const { transfer, isLoading, reset: resetMutation } = useTransfer()
  const navigate = useNavigate()
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [pendingData, setPendingData] = useState<TransferFormData | null>(null)
  const txIdRef = useRef('')

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      category: '',
      description: '',
      amount: '',
    },
  })

  const formattedBalance = Money.fromCents(balanceCents).format()

  const onSubmit = (data: TransferFormData) => {
    setApiError(null)
    const amount = parseFloat(data.amount)
    if (isNaN(amount) || amount <= 0) {
      setApiError('Valor inválido')
      return
    }
    setPendingData(data)
  }

  const buildDescription = (data: TransferFormData) => {
    if (data.description) return `${data.category} — ${data.description}`
    return data.category
  }

  const executeTransfer = async () => {
    if (!pendingData) return
    const amount = parseFloat(pendingData.amount)

    try {
      const result = await transfer({
        fromAccountId: 'acc-1',
        description: buildDescription(pendingData),
        amount,
      })
      txIdRef.current = result.transactionId
      const newBal = Money.fromCents(result.newBalanceCents).format()
      const amtFormatted = Money.fromDecimal(amount).format()

      setPendingData(null)
      setReceiptData({
        category: pendingData.category,
        description: pendingData.description || undefined,
        amount: amtFormatted,
        newBalance: newBal,
        transactionId: txIdRef.current,
        date: new Date(),
      })
      reset()
      toast('Transferência realizada com sucesso!')
    } catch (err) {
      setPendingData(null)
      if (err instanceof InsufficientBalanceError) {
        setApiError('Saldo insuficiente para realizar esta transferência')
      } else {
        setApiError('Erro ao realizar transferência')
      }
    }
  }

  const handleNewTransfer = () => {
    setReceiptData(null)
    resetMutation()
  }

  const pendingAmount = pendingData
    ? Money.fromDecimal(parseFloat(pendingData.amount)).format()
    : ''

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg">
        {/* Page header */}
        <div className="mb-6 animate-fade-in-up">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-4 flex items-center gap-1.5 text-sm font-medium text-surface-500 transition-colors hover:text-surface-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900">
            Nova Transferência
          </h1>
          <p className="mt-1 text-sm text-surface-500">
            Saldo disponível: <span className="font-semibold text-surface-700">{formattedBalance}</span>
          </p>
        </div>

        <Card className="shadow-[var(--shadow-md)] animate-fade-in-up delay-75">
          <CardContent className="p-6">
            {receiptData ? (
              <Receipt
                category={receiptData.category}
                description={receiptData.description}
                amount={receiptData.amount}
                newBalance={receiptData.newBalance}
                date={receiptData.date}
                transactionId={receiptData.transactionId}
                onNewTransfer={handleNewTransfer}
                onGoBack={() => navigate('/dashboard')}
              />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Category dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <CategorySelect
                        id="category"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        state={errors.category ? 'error' : 'default'}
                        placeholder="Selecione a categoria"
                      />
                    )}
                  />
                  {errors.category && (
                    <p className="text-[13px] text-danger-500">{errors.category.message}</p>
                  )}
                </div>

                {/* Optional description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Descrição <span className="font-normal text-surface-400">(opcional)</span>
                  </Label>
                  <Input
                    id="description"
                    placeholder="Ex: Ref. mês de março"
                    state={errors.description ? 'error' : 'default'}
                    {...register('description')}
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor</Label>
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        id="amount"
                        name={field.name}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        state={errors.amount ? 'error' : 'default'}
                      />
                    )}
                  />
                  {errors.amount && (
                    <p className="text-[13px] text-danger-500">{errors.amount.message}</p>
                  )}
                </div>

                {apiError && (
                  <div className="rounded-lg bg-danger-50 px-4 py-3" role="alert">
                    <p className="text-[13px] font-medium text-danger-600">{apiError}</p>
                  </div>
                )}

                <Button type="submit" className="h-11 w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 progress-ring" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
                      </svg>
                      Transferindo...
                    </span>
                  ) : (
                    'Confirmar transferência'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={!!pendingData}
        title="Confirmar transferência"
        description={
          pendingData ? (
            <>
              Deseja transferir <strong>{pendingAmount}</strong> para{' '}
              <strong>{buildDescription(pendingData)}</strong>?
            </>
          ) : ''
        }
        confirmLabel="Transferir"
        onConfirm={executeTransfer}
        onCancel={() => setPendingData(null)}
        loading={isLoading}
      />
    </AppLayout>
  )
}
