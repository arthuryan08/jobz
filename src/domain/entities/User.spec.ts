import { describe, it, expect } from 'vitest'
import { User } from './User'
import { Email } from '@/domain/value-objects'

describe('User', () => {
  it('should create a User', () => {
    const email = Email.create('user@onda.com')
    const user = User.create({ id: '1', name: 'João Silva', email })
    expect(user.id).toBe('1')
    expect(user.name).toBe('João Silva')
    expect(user.email.value).toBe('user@onda.com')
  })
})
