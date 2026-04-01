import type { User } from '@/domain/entities'

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  validatePassword(email: string, password: string): Promise<boolean>
}
