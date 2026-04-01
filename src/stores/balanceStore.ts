import { create } from 'zustand'

interface BalanceState {
  balanceCents: number
  setBalance: (cents: number) => void
  debit: (cents: number) => void
}

export const useBalanceStore = create<BalanceState>()((set) => ({
  balanceCents: 0,
  setBalance: (cents) => set({ balanceCents: cents }),
  debit: (cents) =>
    set((state) => ({ balanceCents: state.balanceCents - cents })),
}))
