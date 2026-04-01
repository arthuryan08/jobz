export class TransactionId {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): TransactionId {
    return new TransactionId(value)
  }

  static generate(): TransactionId {
    return new TransactionId(crypto.randomUUID())
  }

  equals(other: TransactionId): boolean {
    return this.value === other.value
  }
}
