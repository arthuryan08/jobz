export interface AuthInput {
  email: string
  password: string
}

export interface AuthOutput {
  user: {
    id: string
    name: string
    email: string
  }
  token: string
}
