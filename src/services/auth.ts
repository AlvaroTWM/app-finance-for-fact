import type { AuthUser } from '../types/auth'

const SESSION_STORAGE_KEY = 'loyalty-facturas-session'
const GOOGLE_IDENTITY_SCRIPT_ID = 'google-identity-services'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? ''
const GOOGLE_ALLOWED_DOMAIN =
  import.meta.env.VITE_GOOGLE_ALLOWED_DOMAIN?.trim().toLowerCase() ?? 'itti.digital'
const GOOGLE_SCOPES = 'openid email profile'

interface GoogleProfile {
  email: string
  hd?: string
  name: string
  picture?: string
  sub: string
}

interface StoredSession extends AuthUser {
  accessToken: string
  expiresAt: number
}

let googleIdentityScriptPromise: Promise<void> | null = null

function hasUsableGoogleClientId() {
  return Boolean(GOOGLE_CLIENT_ID) && !GOOGLE_CLIENT_ID.startsWith('TU_CLIENT_ID_')
}

function getSessionStorage() {
  return typeof window !== 'undefined' ? window.sessionStorage : null
}

function storeSession(session: StoredSession) {
  getSessionStorage()?.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

function parseStoredSession() {
  const rawSession = getSessionStorage()?.getItem(SESSION_STORAGE_KEY)

  if (!rawSession) {
    return null
  }

  try {
    const parsedSession = JSON.parse(rawSession) as StoredSession

    if (!parsedSession.accessToken || !parsedSession.email || parsedSession.expiresAt <= Date.now()) {
      clearStoredSession()
      return null
    }

    return parsedSession
  } catch {
    clearStoredSession()
    return null
  }
}

function ensureGoogleClientId() {
  if (!hasUsableGoogleClientId()) {
    throw new Error(
      'Falta configurar VITE_GOOGLE_CLIENT_ID para habilitar el inicio de sesion con Google.',
    )
  }
}

function loadGoogleIdentityScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Login solo esta disponible en el navegador.'))
  }

  if (window.google?.accounts?.oauth2) {
    return Promise.resolve()
  }

  if (googleIdentityScriptPromise) {
    return googleIdentityScriptPromise
  }

  googleIdentityScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_IDENTITY_SCRIPT_ID) as
      | HTMLScriptElement
      | null

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('No pudimos cargar Google Identity Services.')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_IDENTITY_SCRIPT_ID
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('No pudimos cargar Google Identity Services.'))

    document.head.appendChild(script)
  })

  return googleIdentityScriptPromise
}

function requestGoogleAccessToken() {
  return new Promise<GoogleTokenResponse>((resolve, reject) => {
    const googleApi = window.google

    if (!googleApi?.accounts?.oauth2) {
      reject(new Error('Google Identity Services no termino de inicializarse.'))
      return
    }

    const tokenClient = googleApi.accounts.oauth2.initTokenClient({
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error_description || response.error))
          return
        }

        resolve(response)
      },
      client_id: GOOGLE_CLIENT_ID,
      error_callback: (error) => {
        reject(new Error(error.message || 'No fue posible completar el login con Google.'))
      },
      scope: GOOGLE_SCOPES,
    })

    tokenClient.requestAccessToken({
      prompt: 'select_account',
    })
  })
}

async function fetchGoogleProfile(accessToken: string) {
  const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('No pudimos leer el perfil de Google de esta sesion.')
  }

  return (await response.json()) as GoogleProfile
}

function validateGoogleProfile(profile: GoogleProfile) {
  const normalizedEmail = profile.email.trim().toLowerCase()
  const normalizedHostedDomain = profile.hd?.trim().toLowerCase()
  const isAllowedDomain =
    normalizedHostedDomain === GOOGLE_ALLOWED_DOMAIN ||
    normalizedEmail.endsWith(`@${GOOGLE_ALLOWED_DOMAIN}`)

  if (!isAllowedDomain) {
    throw new Error(`Usa una cuenta de Google del dominio ${GOOGLE_ALLOWED_DOMAIN}.`)
  }
}

function buildUser(profile: GoogleProfile): AuthUser {
  return {
    email: profile.email,
    id: profile.sub,
    name: profile.name,
    picture: profile.picture,
    role: 'Alianzas',
  }
}

export async function loginWithGoogle() {
  ensureGoogleClientId()
  await loadGoogleIdentityScript()

  const tokenResponse = await requestGoogleAccessToken()
  const profile = await fetchGoogleProfile(tokenResponse.access_token)

  validateGoogleProfile(profile)

  const user = buildUser(profile)
  const expiresInSeconds = Number(tokenResponse.expires_in ?? 3600)

  storeSession({
    ...user,
    accessToken: tokenResponse.access_token,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  })

  return user
}

export function getStoredSession(): AuthUser | null {
  const session = parseStoredSession()

  if (!session) {
    return null
  }

  const { accessToken: _accessToken, expiresAt: _expiresAt, ...user } = session
  return user
}

export function getStoredAccessToken() {
  return parseStoredSession()?.accessToken ?? null
}

export function isGoogleLoginConfigured() {
  return hasUsableGoogleClientId()
}

export function clearStoredSession() {
  getSessionStorage()?.removeItem(SESSION_STORAGE_KEY)
}
