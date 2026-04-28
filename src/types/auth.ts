import type { UserRole } from './invoice'

export interface AuthUser {
  email: string
  id: string
  name: string
  role: UserRole
}

export interface LoginCredentials {
  identifier: string
  password: string
}

export interface DemoAccount extends AuthUser {
  password: string
}
