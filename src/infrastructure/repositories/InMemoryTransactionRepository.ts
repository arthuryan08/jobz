import type { TransactionRepository } from '@/domain/repositories'
import { Transaction } from '@/domain/entities'
import { Money, TransactionId } from '@/domain/value-objects'
import { mockTransactions } from '@/infrastructure/mocks'

interface TxData {
  id: string
  accountId: string
  description: string
  amountCents: number
  date: string
  type: 'credit' | 'debit'
}

const store: TxData[] = mockTransactions.map((t) => ({ ...t }))

function toEntity(data: TxData): Transaction {
  return Transaction.create({
    id: TransactionId.create(data.id),
    description: data.description,
    amount: Money.fromCents(data.amountCents),
    date: new Date(data.date),
    type: data.type,
  })
}

export class InMemoryTransactionRepository implements TransactionRepository {
  async findByAccountId(accountId: string): Promise<Transaction[]> {
    return store
      .filter((t) => t.accountId === accountId)
      .map(toEntity)
  }

  async save(transaction: Transaction): Promise<void> {
    store.unshift({
      id: transaction.id.value,
      accountId: 'acc-1',
      description: transaction.description,
      amountCents: transaction.amount.cents,
      date: transaction.date.toISOString(),
      type: transaction.type,
    })
  }

  reset(): void {
    store.length = 0
    for (const t of mockTransactions) {
      store.push({ ...t })
    }
  }
}
