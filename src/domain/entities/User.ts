import type { Email } from '@/domain/value-objects'

interface UserProps {
  id: string
  name: string
  email: Email
}

export class User {
  readonly id: string
  readonly name: string
  readonly email: Email

  private constructor(props: UserProps) {
    this.id = props.id
    this.name = props.name
    this.email = props.email
  }

  static create(props: UserProps): User {
    return new User(props)
  }
}
