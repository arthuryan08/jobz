import { describe, it, expect, vi } from 'vitest'
import { TransferFunds } from './TransferFunds'
import type { AccountRepository, TransactionRepository } from '@/domain/repositories'
import { Account } from '@/domain/entities'
import { Money } from '@/domain/value-objects'
import { InsufficientBalanceError } from '@/domain/errors'

function setup(balanceCents = 500000) {
  const account = Account.create({
    id: 'acc-1',
    userId: 'user-1',
    balance: Money.fromCents(balanceCents),
  })

  const accountRepo: AccountRepository = {
    findById: async () => account,
    findByUserId: async () => account,
    update: vi.fn(async () => {}),
  }

  const txRepo: TransactionRepository = {
    findByAccountId: async () => [],
    save: vi.fn(async () => {}),
  }

  const useCase = new TransferFunds(accountRepo, txRepo)
  return { useCase, accountRepo, txRepo }
}

describe('TransferFunds', () => {
  it('should transfer funds and return new balance', async () => {
    const { useCase, accountRepo, txRepo } = setup(500000)

    const result = await useCase.execute({
      fromAccountId: 'acc-1',
      description: 'Pagamento fornecedor',
      amount: 1500.00,
    })

    expect(result.newBalanceCents).toBe(350000) // 5000 - 1500 = 3500
    expect(result.transactionId).toBeTruthy()
    expect(accountRepo.update).toHaveBeenCalledOnce()
    expect(txRepo.save).toHaveBeenCalledOnce()
  })

  it('should throw InsufficientBalanceError when balance is insufficient', async () => {
    const { useCase } = setup(100000) // R$1.000

    await expect(
      useCase.execute({
        fromAccountId: 'acc-1',
        description: 'Transferência grande',
        amount: 2000.00,
      }),
    ).rejects.toThrow(InsufficientBalanceError)
  })

  it('should throw for invalid amount', async () => {
    const { useCase } = setup()

    await expect(
      useCase.execute({
        fromAccountId: 'acc-1',
        description: 'Nada',
        amount: 0,
      }),
    ).rejects.toThrow()
  })
})
