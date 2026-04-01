import { useQuery } from '@tanstack/react-query'
import { listTransactionsUseCase } from '@/shared/lib/services'

export function useTransactions(accountId: string) {
  return useQuery({
    queryKey: ['transactions', accountId],
    queryFn: () => listTransactionsUseCase.execute(accountId),
    enabled: !!accountId,
    staleTime: 1000 * 60 * 2,
  })
}
