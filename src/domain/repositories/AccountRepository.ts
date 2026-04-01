import type { Account } from '@/domain/entities'

export interface AccountRepository {
  findById(id: string): Promise<Account | null>
  findByUserId(userId: string): Promise<Account | null>
  update(account: Account): Promise<void>
}
