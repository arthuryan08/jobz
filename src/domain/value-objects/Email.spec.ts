import { describe, it, expect } from 'vitest'
import { Email } from './Email'
import { InvalidEmailError } from '@/domain/errors'

describe('Email', () => {
  it('should create a valid Email', () => {
    const email = Email.create('user@onda.com')
    expect(email.value).toBe('user@onda.com')
  })

  it('should trim and lowercase the email', () => {
    const email = Email.create('  User@Onda.COM  ')
    expect(email.value).toBe('user@onda.com')
  })

  it('should throw for invalid email format', () => {
    expect(() => Email.create('invalid')).toThrow(InvalidEmailError)
    expect(() => Email.create('')).toThrow(InvalidEmailError)
    expect(() => Email.create('no@')).toThrow(InvalidEmailError)
  })

  it('should compare equality', () => {
    const a = Email.create('user@onda.com')
    const b = Email.create('user@onda.com')
    expect(a.equals(b)).toBe(true)
  })
})
