import type { Transaction } from '@/domain/entities'

export interface TransactionRepository {
  findByAccountId(accountId: string): Promise<Transaction[]>
  save(transaction: Transaction): Promise<void>
}
