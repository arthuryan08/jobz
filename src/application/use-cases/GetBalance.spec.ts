import { describe, it, expect } from 'vitest'
import { GetBalance } from './GetBalance'
import type { AccountRepository } from '@/domain/repositories'
import { Account } from '@/domain/entities'
import { Money } from '@/domain/value-objects'

describe('GetBalance', () => {
  it('should return the account balance in cents', async () => {
    const account = Account.create({
      id: 'acc-1',
      userId: 'user-1',
      balance: Money.fromCents(500000),
    })
    const repo: AccountRepository = {
      findById: async () => account,
      findByUserId: async () => account,
      update: async () => {},
    }
    const useCase = new GetBalance(repo)
    const result = await useCase.execute('user-1')
    expect(result.cents).toBe(500000)
  })

  it('should throw if account not found', async () => {
    const repo: AccountRepository = {
      findById: async () => null,
      findByUserId: async () => null,
      update: async () => {},
    }
    const useCase = new GetBalance(repo)
    await expect(useCase.execute('unknown')).rejects.toThrow('Conta não encontrada')
  })
})
