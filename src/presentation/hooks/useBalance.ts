import { useQuery } from '@tanstack/react-query'
import { useAuthStore, useBalanceStore } from '@/stores'
import { getBalanceUseCase } from '@/shared/lib/services'
import { useEffect } from 'react'

export function useBalance() {
  const userId = useAuthStore((s) => s.user?.id)
  const setBalance = useBalanceStore((s) => s.setBalance)
  const balanceCents = useBalanceStore((s) => s.balanceCents)

  const query = useQuery({
    queryKey: ['balance', userId],
    queryFn: async () => {
      if (!userId) throw new Error('Usuário não autenticado')
      const money = await getBalanceUseCase.execute(userId)
      return money.cents
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (query.data !== undefined) {
      setBalance(query.data)
    }
  }, [query.data, setBalance])

  return {
    balanceCents,
    isLoading: query.isLoading,
    refetch: query.refetch,
  }
}
