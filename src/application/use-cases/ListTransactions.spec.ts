import { describe, it, expect } from 'vitest'
import { ListTransactions } from './ListTransactions'
import type { TransactionRepository } from '@/domain/repositories'
import { Transaction } from '@/domain/entities'
import { Money, TransactionId } from '@/domain/value-objects'

describe('ListTransactions', () => {
  it('should return transactions sorted by date descending', async () => {
    const tx1 = Transaction.create({
      id: TransactionId.create('tx-1'),
      description: 'Salário',
      amount: Money.fromCents(300000),
      date: new Date('2026-03-01'),
      type: 'credit',
    })
    const tx2 = Transaction.create({
      id: TransactionId.create('tx-2'),
      description: 'Aluguel',
      amount: Money.fromCents(120000),
      date: new Date('2026-03-15'),
      type: 'debit',
    })

    const repo: TransactionRepository = {
      findByAccountId: async () => [tx1, tx2],
      save: async () => {},
    }
    const useCase = new ListTransactions(repo)
    const result = await useCase.execute('acc-1')

    expect(result).toHaveLength(2)
    expect(result[0].id.value).toBe('tx-2') // newer first
    expect(result[1].id.value).toBe('tx-1')
  })

  it('should return empty array if no transactions', async () => {
    const repo: TransactionRepository = {
      findByAccountId: async () => [],
      save: async () => {},
    }
    const useCase = new ListTransactions(repo)
    const result = await useCase.execute('acc-1')
    expect(result).toEqual([])
  })
})
