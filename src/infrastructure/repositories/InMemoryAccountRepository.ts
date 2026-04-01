import type { AccountRepository } from '@/domain/repositories'
import { Account } from '@/domain/entities'
import { Money } from '@/domain/value-objects'
import { mockAccounts } from '@/infrastructure/mocks'

interface AccountData {
  id: string
  userId: string
  balanceCents: number
}

const store: Map<string, AccountData> = new Map(
  mockAccounts.map((a) => [a.id, { ...a }]),
)

function toEntity(data: AccountData): Account {
  return Account.create({
    id: data.id,
    userId: data.userId,
    balance: Money.fromCents(data.balanceCents),
  })
}

export class InMemoryAccountRepository implements AccountRepository {
  async findById(id: string): Promise<Account | null> {
    const data = store.get(id)
    return data ? toEntity(data) : null
  }

  async findByUserId(userId: string): Promise<Account | null> {
    for (const data of store.values()) {
      if (data.userId === userId) return toEntity(data)
    }
    return null
  }

  async update(account: Account): Promise<void> {
    store.set(account.id, {
      id: account.id,
      userId: account.userId,
      balanceCents: account.balance.cents,
    })
  }

  reset(): void {
    store.clear()
    for (const a of mockAccounts) {
      store.set(a.id, { ...a })
    }
  }
}
