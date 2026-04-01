import { Authenticate, GetBalance, ListTransactions, TransferFunds } from '@/application/use-cases'
import {
  InMemoryUserRepository,
  InMemoryAccountRepository,
  InMemoryTransactionRepository,
} from '@/infrastructure/repositories'

const userRepository = new InMemoryUserRepository()
const accountRepository = new InMemoryAccountRepository()
const transactionRepository = new InMemoryTransactionRepository()

export const authenticateUseCase = new Authenticate(userRepository)
export const getBalanceUseCase = new GetBalance(accountRepository)
export const listTransactionsUseCase = new ListTransactions(transactionRepository)
export const transferFundsUseCase = new TransferFunds(accountRepository, transactionRepository)
