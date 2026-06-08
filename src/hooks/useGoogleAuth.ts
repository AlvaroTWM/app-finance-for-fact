import { useState } from 'react'

import {
  clearStoredSession,
  getStoredSession,
  isGoogleLoginConfigured,
  loginWithGoogle,
} from '../services/auth'

export function useGoogleAuth() {
  const [user, setUser] = useState(() => getStoredSession())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const authenticatedUser = await loginWithGoogle()
      setUser(authenticatedUser)
      return authenticatedUser
    } catch (loginError) {
      const message =
        loginError instanceof Error
          ? loginError.message
          : 'No fue posible iniciar sesion con Google.'
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
    error,
    isAuthenticated: Boolean(user),
    isGoogleLoginConfigured: isGoogleLoginConfigured(),
    isSubmitting,
    login,
    logout,
    user,
  }
}
