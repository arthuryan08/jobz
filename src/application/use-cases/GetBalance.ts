import { DomainError } from '@/domain/errors'
import type { AccountRepository } from '@/domain/repositories'
import type { Money } from '@/domain/value-objects'

export class GetBalance {
  private readonly accountRepository: AccountRepository

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository
  }

  async execute(userId: string): Promise<Money> {
    const account = await this.accountRepository.findByUserId(userId)
    if (!account) throw new DomainError('Conta não encontrada')
    return account.balance
  }
}
