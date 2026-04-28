import type { AuthUser, DemoAccount, LoginCredentials } from '../types/auth'

const SESSION_STORAGE_KEY = 'loyalty-facturas-session'

export const demoAccounts: DemoAccount[] = [
  {
    email: 'aliado@loyalty.local',
    id: 'aliado-001',
    name: 'BIGGIE',
    password: 'Aliado123*',
    role: 'Aliado',
  },
  {
    email: 'alianzas@loyalty.local',
    id: 'alianzas-001',
    name: 'Maria Paz',
    password: 'Alianzas123*',
    role: 'Alianzas',
  },
]

function sanitizeUser(account: DemoAccount): AuthUser {
  return {
    email: account.email,
    id: account.id,
    name: account.name,
    role: account.role,
  }
}

export async function loginWithTempCredentials({
  identifier,
  password,
}: LoginCredentials): Promise<AuthUser> {
  const normalizedIdentifier = identifier.trim().toLowerCase()

  const account = demoAccounts.find(
    (demoAccount) =>
      (demoAccount.email.toLowerCase() === normalizedIdentifier ||
        demoAccount.name.toLowerCase() === normalizedIdentifier) &&
      demoAccount.password === password,
  )

  await new Promise((resolve) => window.setTimeout(resolve, 500))

  if (!account) {
    throw new Error('Credenciales invalidas. Usa una cuenta demo valida.')
  }

  const user = sanitizeUser(account)
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))

  return user
}

export function getStoredSession(): AuthUser | null {
  const storedSession = sessionStorage.getItem(SESSION_STORAGE_KEY)

  if (!storedSession) {
    return null
  }

  try {
    const parsedSession = JSON.parse(storedSession) as AuthUser
    return parsedSession
  } catch {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }
}

export function clearStoredSession() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY)
}
