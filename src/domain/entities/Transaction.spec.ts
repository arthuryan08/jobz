import { describe, it, expect } from 'vitest'
import { Transaction } from './Transaction'
import { Money, TransactionId } from '@/domain/value-objects'

describe('Transaction', () => {
  it('should create a credit transaction', () => {
    const tx = Transaction.create({
      id: TransactionId.create('tx-1'),
      description: 'Salário',
      amount: Money.fromCents(300000),
      date: new Date('2026-03-01'),
      type: 'credit',
    })
    expect(tx.id.value).toBe('tx-1')
    expect(tx.description).toBe('Salário')
    expect(tx.amount.cents).toBe(300000)
    expect(tx.type).toBe('credit')
  })

  it('should create a debit transaction', () => {
    const tx = Transaction.create({
      id: TransactionId.create('tx-2'),
      description: 'Aluguel',
      amount: Money.fromCents(120000),
      date: new Date('2026-03-05'),
      type: 'debit',
    })
    expect(tx.type).toBe('debit')
    expect(tx.amount.cents).toBe(120000)
  })
})
