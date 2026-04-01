export interface MockTransaction {
  id: string
  accountId: string
  description: string
  amountCents: number
  date: string
  type: 'credit' | 'debit'
}

export const mockTransactions: MockTransaction[] = [
  {
    id: 'tx-1',
    accountId: 'acc-1',
    description: 'Salário',
    amountCents: 300000,
    date: '2026-03-25',
    type: 'credit',
  },
  {
    id: 'tx-2',
    accountId: 'acc-1',
    description: 'Aluguel',
    amountCents: 120000,
    date: '2026-03-20',
    type: 'debit',
  },
  {
    id: 'tx-3',
    accountId: 'acc-1',
    description: 'Supermercado',
    amountCents: 45000,
    date: '2026-03-18',
    type: 'debit',
  },
  {
    id: 'tx-4',
    accountId: 'acc-1',
    description: 'Freelance',
    amountCents: 80000,
    date: '2026-03-15',
    type: 'credit',
  },
  {
    id: 'tx-5',
    accountId: 'acc-1',
    description: 'Internet',
    amountCents: 15000,
    date: '2026-03-10',
    type: 'debit',
  },
]
