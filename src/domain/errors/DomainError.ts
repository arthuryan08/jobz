export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class InsufficientBalanceError extends DomainError {
  constructor() {
    super('Saldo insuficiente para realizar esta operação')
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('E-mail ou senha inválidos')
  }
}

export class InvalidEmailError extends DomainError {
  constructor(email: string) {
    super(`E-mail inválido: ${email}`)
  }
}

export class InvalidAmountError extends DomainError {
  constructor() {
    super('O valor deve ser maior que zero')
  }
}
