import { describe, it, expect } from 'vitest'
import { Money } from './Money'
import { InvalidAmountError } from '@/domain/errors'

describe('Money', () => {
  it('should create a Money instance with valid amount in cents', () => {
    const money = Money.fromCents(500000)
    expect(money.cents).toBe(500000)
  })

  it('should create from decimal (reais)', () => {
    const money = Money.fromDecimal(5000)
    expect(money.cents).toBe(500000)
  })

  it('should throw for negative amount', () => {
    expect(() => Money.fromCents(-1)).toThrow(InvalidAmountError)
  })

  it('should add two Money values', () => {
    const a = Money.fromCents(10000)
    const b = Money.fromCents(5000)
    const result = a.add(b)
    expect(result.cents).toBe(15000)
  })

  it('should subtract two Money values', () => {
    const a = Money.fromCents(10000)
    const b = Money.fromCents(3000)
    const result = a.subtract(b)
    expect(result.cents).toBe(7000)
  })

  it('should throw InsufficientBalanceError when subtracting more than available', () => {
    const a = Money.fromCents(1000)
    const b = Money.fromCents(2000)
    expect(() => a.subtract(b)).toThrow('Saldo insuficiente')
  })

  it('should compare with isGreaterThanOrEqual', () => {
    const a = Money.fromCents(5000)
    const b = Money.fromCents(3000)
    const c = Money.fromCents(5000)
    expect(a.isGreaterThanOrEqual(b)).toBe(true)
    expect(a.isGreaterThanOrEqual(c)).toBe(true)
    expect(b.isGreaterThanOrEqual(a)).toBe(false)
  })

  it('should format as BRL currency', () => {
    const money = Money.fromCents(500000)
    const formatted = money.format()
    expect(formatted).toContain('5.000,00')
  })

  it('should be zero', () => {
    const money = Money.fromCents(0)
    expect(money.cents).toBe(0)
    expect(money.isZero()).toBe(true)
  })

  it('should return decimal value', () => {
    const money = Money.fromCents(500050)
    expect(money.toDecimal()).toBeCloseTo(5000.5)
  })
})
