export interface TransferInput {
  fromAccountId: string
  description: string
  amount: number
}

export interface TransferOutput {
  transactionId: string
  newBalanceCents: number
}
