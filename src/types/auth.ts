import type { UserRole } from './invoice'

export interface AuthUser {
  email: string
  id: string
  name: string
  picture?: string
  role: UserRole
}
