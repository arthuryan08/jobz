import type { Transaction } from '@/domain/entities'
import type { TransactionRepository } from '@/domain/repositories'

export class ListTransactions {
  private readonly transactionRepository: TransactionRepository

  constructor(transactionRepository: TransactionRepository) {
    this.transactionRepository = transactionRepository
  }

  async execute(accountId: string): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.findByAccountId(accountId)
    return transactions.sort(
      (a, b) => b.date.getTime() - a.date.getTime(),
    )
  }
}
