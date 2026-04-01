import type { UserRepository } from '@/domain/repositories'
import { User } from '@/domain/entities'
import { Email } from '@/domain/value-objects'
import { mockUsers } from '@/infrastructure/mocks'

export class InMemoryUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const found = mockUsers.find((u) => u.email === email)
    if (!found) return null
    return User.create({
      id: found.id,
      name: found.name,
      email: Email.create(found.email),
    })
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const found = mockUsers.find((u) => u.email === email)
    return found?.password === password
  }
}
