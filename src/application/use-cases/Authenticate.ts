import { InvalidCredentialsError } from '@/domain/errors'
import type { UserRepository } from '@/domain/repositories'
import type { AuthInput, AuthOutput } from '@/application/dtos'

export class Authenticate {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async execute(input: AuthInput): Promise<AuthOutput> {
    const user = await this.userRepository.findByEmail(input.email)
    if (!user) throw new InvalidCredentialsError()

    const valid = await this.userRepository.validatePassword(
      input.email,
      input.password,
    )
    if (!valid) throw new InvalidCredentialsError()

    const token = btoa(`${user.id}:${Date.now()}`)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email.value,
      },
      token,
    }
  }
}
