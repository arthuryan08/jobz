import type { Money, TransactionId } from '@/domain/value-objects'

export type TransactionType = 'credit' | 'debit'

interface TransactionProps {
  id: TransactionId
  description: string
  amount: Money
  date: Date
  type: TransactionType
}

export class Transaction {
  readonly id: TransactionId
  readonly description: string
  readonly amount: Money
  readonly date: Date
  readonly type: TransactionType

  private constructor(props: TransactionProps) {
    this.id = props.id
    this.description = props.description
    this.amount = props.amount
    this.date = props.date
    this.type = props.type
  }

  static create(props: TransactionProps): Transaction {
    return new Transaction(props)
  }
}
