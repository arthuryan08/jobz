import type { Money } from '@/domain/value-objects'

interface AccountProps {
  id: string
  userId: string
  balance: Money
}

export class Account {
  readonly id: string
  readonly userId: string
  readonly balance: Money

  private constructor(props: AccountProps) {
    this.id = props.id
    this.userId = props.userId
    this.balance = props.balance
  }

  static create(props: AccountProps): Account {
    return new Account(props)
  }

  credit(amount: Money): Account {
    return new Account({
      id: this.id,
      userId: this.userId,
      balance: this.balance.add(amount),
    })
  }

  debit(amount: Money): Account {
    return new Account({
      id: this.id,
      userId: this.userId,
      balance: this.balance.subtract(amount),
    })
  }
}
