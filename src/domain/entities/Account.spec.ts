import { describe, it, expect } from 'vitest'
import { Account } from './Account'
import { Money } from '@/domain/value-objects'
import { InsufficientBalanceError } from '@/domain/errors'

describe('Account', () => {
  it('should create an Account with initial balance', () => {
    const balance = Money.fromCents(500000)
    const account = Account.create({ id: 'acc-1', userId: 'user-1', balance })
    expect(account.id).toBe('acc-1')
    expect(account.userId).toBe('user-1')
    expect(account.balance.cents).toBe(500000)
  })

  it('should credit an amount (returns new instance)', () => {
    const account = Account.create({
      id: 'acc-1',
      userId: 'user-1',
      balance: Money.fromCents(500000),
    })
    const credited = account.credit(Money.fromCents(100000))
    expect(credited.balance.cents).toBe(600000)
    expect(account.balance.cents).toBe(500000) // original unchanged
  })

  it('should debit an amount (returns new instance)', () => {
    const account = Account.create({
      id: 'acc-1',
      userId: 'user-1',
      balance: Money.fromCents(500000),
    })
    const debited = account.debit(Money.fromCents(200000))
    expect(debited.balance.cents).toBe(300000)
    expect(account.balance.cents).toBe(500000) // original unchanged
  })

  it('should throw InsufficientBalanceError when debiting more than balance', () => {
    const account = Account.create({
      id: 'acc-1',
      userId: 'user-1',
      balance: Money.fromCents(100000),
    })
    expect(() => account.debit(Money.fromCents(200000))).toThrow(InsufficientBalanceError)
  })
})
