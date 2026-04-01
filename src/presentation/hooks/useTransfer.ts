import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useBalanceStore } from '@/stores'
import { transferFundsUseCase } from '@/shared/lib/services'
import type { TransferInput } from '@/application/dtos'

export function useTransfer() {
  const queryClient = useQueryClient()
  const setBalance = useBalanceStore((s) => s.setBalance)

  const mutation = useMutation({
    mutationFn: (input: TransferInput) =>
      transferFundsUseCase.execute(input),
    onSuccess: (result) => {
      setBalance(result.newBalanceCents)
      queryClient.invalidateQueries({ queryKey: ['balance'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  return {
    transfer: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  }
}
