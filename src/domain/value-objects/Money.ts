import { InsufficientBalanceError, InvalidAmountError } from '@/domain/errors'

const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export class Money {
  readonly cents: number

  private constructor(cents: number) {
    this.cents = Math.round(cents)
  }

  static fromCents(cents: number): Money {
    if (cents < 0) throw new InvalidAmountError()
    return new Money(cents)
  }

  static fromDecimal(value: number): Money {
    if (value < 0) throw new InvalidAmountError()
    return new Money(value * 100)
  }

  add(other: Money): Money {
    return Money.fromCents(this.cents + other.cents)
  }

  subtract(other: Money): Money {
    if (this.cents < other.cents) throw new InsufficientBalanceError()
    return Money.fromCents(this.cents - other.cents)
  }

  isGreaterThanOrEqual(other: Money): boolean {
    return this.cents >= other.cents
  }

  isZero(): boolean {
    return this.cents === 0
  }

  toDecimal(): number {
    return this.cents / 100
  }

  format(): string {
    return brlFormatter.format(this.toDecimal())
  }
}
