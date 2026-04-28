import { useState } from 'react'

import {
  clearStoredSession,
  demoAccounts,
  getStoredSession,
  loginWithTempCredentials,
} from '../services/auth'
import type { AuthUser, LoginCredentials } from '../types/auth'

export function useTempAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredSession())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (credentials: LoginCredentials) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const authenticatedUser = await loginWithTempCredentials(credentials)
      setUser(authenticatedUser)
      return authenticatedUser
    } catch (loginError) {
      const message =
        loginError instanceof Error
          ? loginError.message
          : 'No fue posible iniciar sesion.'
      setError(message)
      throw new Error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const logout = () => {
    clearStoredSession()
    setUser(null)
    setError(null)
  }

  return {
    demoAccounts,
    error,
    isAuthenticated: Boolean(user),
    isSubmitting,
    login,
    logout,
    user,
  }
}
