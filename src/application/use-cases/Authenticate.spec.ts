import { describe, it, expect, beforeEach } from 'vitest'
import { Authenticate } from './Authenticate'
import { InvalidCredentialsError } from '@/domain/errors'
import type { UserRepository } from '@/domain/repositories'
import { User } from '@/domain/entities'
import { Email } from '@/domain/value-objects'

function createMockUserRepository(overrides?: Partial<UserRepository>): UserRepository {
  return {
    findByEmail: overrides?.findByEmail ?? (async () => null),
    validatePassword: overrides?.validatePassword ?? (async () => false),
  }
}

describe('Authenticate', () => {
  let useCase: Authenticate

  const mockUser = User.create({
    id: '1',
    name: 'João Silva',
    email: Email.create('user@onda.com'),
  })

  beforeEach(() => {
    const repo = createMockUserRepository({
      findByEmail: async (email) =>
        email === 'user@onda.com' ? mockUser : null,
      validatePassword: async (email, password) =>
        email === 'user@onda.com' && password === '123456',
    })
    useCase = new Authenticate(repo)
  })

  it('should authenticate with valid credentials', async () => {
    const result = await useCase.execute({
      email: 'user@onda.com',
      password: '123456',
    })
    expect(result.user.id).toBe('1')
    expect(result.user.name).toBe('João Silva')
    expect(result.user.email).toBe('user@onda.com')
    expect(result.token).toBeTruthy()
  })

  it('should throw InvalidCredentialsError for wrong email', async () => {
    await expect(
      useCase.execute({ email: 'wrong@onda.com', password: '123456' }),
    ).rejects.toThrow(InvalidCredentialsError)
  })

  it('should throw InvalidCredentialsError for wrong password', async () => {
    await expect(
      useCase.execute({ email: 'user@onda.com', password: 'wrong' }),
    ).rejects.toThrow(InvalidCredentialsError)
  })
})
