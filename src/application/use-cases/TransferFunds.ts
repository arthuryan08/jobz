import { InvalidAmountError } from '@/domain/errors'
import { Transaction } from '@/domain/entities'
import { Money, TransactionId } from '@/domain/value-objects'
import type { AccountRepository, TransactionRepository } from '@/domain/repositories'
import type { TransferInput, TransferOutput } from '@/application/dtos'

export class TransferFunds {
  private readonly accountRepository: AccountRepository
  private readonly transactionRepository: TransactionRepository

  constructor(
    accountRepository: AccountRepository,
    transactionRepository: TransactionRepository,
  ) {
    this.accountRepository = accountRepository
    this.transactionRepository = transactionRepository
  }

  async execute(input: TransferInput): Promise<TransferOutput> {
    if (input.amount <= 0) throw new InvalidAmountError()

    const amount = Money.fromDecimal(input.amount)

    const account = await this.accountRepository.findById(input.fromAccountId)
    if (!account) throw new Error('Conta não encontrada')

    const debited = account.debit(amount)

    const transaction = Transaction.create({
      id: TransactionId.generate(),
      description: input.description,
      amount,
      date: new Date(),
      type: 'debit',
    })

    await this.accountRepository.update(debited)
    await this.transactionRepository.save(transaction)

    return {
      transactionId: transaction.id.value,
      newBalanceCents: debited.balance.cents,
    }
  }
}
