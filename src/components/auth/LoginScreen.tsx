import {
  ArrowLeftIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../ui/Button'
import type { DemoAccount, LoginCredentials } from '../../types/auth'

interface LoginScreenProps {
  demoAccounts: DemoAccount[]
  error?: string | null
  isSubmitting?: boolean
  onBackToLanding: () => void
  onLogin: (credentials: LoginCredentials) => Promise<unknown>
}

const savedAccountEmail = 'aliado@loyalty.local'

export function LoginScreen({
  demoAccounts,
  error = null,
  isSubmitting = false,
  onBackToLanding,
  onLogin,
}: LoginScreenProps) {
  const defaultAccount =
    demoAccounts.find((account) => account.email === savedAccountEmail) ?? demoAccounts[0]
  const [selectedAccountEmail, setSelectedAccountEmail] = useState(
    defaultAccount?.email ?? savedAccountEmail,
  )
  const selectedAccount =
    demoAccounts.find((account) => account.email === selectedAccountEmail) ?? defaultAccount
  const [password, setPassword] = useState(selectedAccount?.password ?? '')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSelectAccount = (account: DemoAccount) => {
    setSelectedAccountEmail(account.email)
    setPassword(account.password)
    setShowPassword(false)
    setLocalError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError(null)

    if (!selectedAccount?.email || !password.trim()) {
      setLocalError('Ingresa tu contrasena para continuar.')
      return
    }

    try {
      await onLogin({
        identifier: selectedAccount.email,
        password,
      })
    } catch {
      return
    }
  }

  const currentError = localError ?? error

  return (
    <main className="login-shell relative flex min-h-screen flex-col overflow-hidden px-5 py-6 text-slate-950 sm:px-8">
      <header className="animate-fade-down relative z-10 flex min-h-10 items-center justify-between">
        <div className="flex items-center gap-3 text-emerald-900">
          <div className="grid size-8 place-items-center rounded-lg border border-emerald-700/20 bg-white/60 shadow-sm">
            <span className="text-sm font-black">L</span>
          </div>
          <span className="text-sm font-black tracking-[0.24em]">Loyalty Pagos</span>
        </div>

        <button
          type="button"
          onClick={onBackToLanding}
          className="interactive-lift inline-flex items-center gap-2 rounded-full bg-white/65 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-white hover:text-slate-950"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">Volver al inicio</span>
          <span className="sm:hidden">Inicio</span>
        </button>
      </header>

      <section className="login-panel relative z-10 mx-auto flex flex-1 flex-col justify-center py-10 sm:py-12">
        <div className="animate-fade-up animate-delay-1 text-center">
          <h1 className="text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl">
            Nos alegra verte
          </h1>
          <p className="mx-auto mt-4 max-w-[340px] text-base leading-7 text-slate-600">
            Por favor, introduce tus credenciales para acceder.
          </p>
        </div>

        <form className="mt-9 space-y-4" onSubmit={handleSubmit}>
          <div className="animate-soft-pop animate-delay-2 space-y-3">
            <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
              Elegi tu portal
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {demoAccounts.map((account) => {
                const isSelected = account.email === selectedAccount?.email

                return (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => handleSelectAccount(account)}
                    className={`surface-shine interactive-lift rounded-2xl border p-4 text-left shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur ${
                      isSelected
                        ? 'border-emerald-500/45 bg-emerald-50/90'
                        : 'border-emerald-900/10 bg-white/75 hover:border-emerald-300/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid size-11 shrink-0 place-items-center rounded-full ${
                          isSelected
                            ? 'bg-emerald-500 text-emerald-950'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <UserCircleIcon aria-hidden="true" className="size-7" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-950">{account.role}</p>
                        <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                          {account.email}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-emerald-800">
                      {isSelected ? 'Portal seleccionado' : 'Click para usar este acceso'}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          <label className="animate-soft-pop animate-delay-3 block rounded-lg border border-emerald-900/10 bg-white/80 px-4 py-3 shadow-[0_14px_40px_rgba(15,23,42,0.07)] backdrop-blur focus-within:border-emerald-700/40 focus-within:ring-4 focus-within:ring-emerald-100">
            <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Contraseña
            </span>
            <div className="mt-2 flex items-center gap-3">
              <input
                autoComplete="current-password"
                className="min-w-0 flex-1 bg-transparent text-lg font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Contrasena"
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                onClick={() => setShowPassword((currentValue) => !currentValue)}
                className="interactive-lift grid size-9 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                {showPassword ? (
                  <EyeSlashIcon aria-hidden="true" className="size-5" />
                ) : (
                  <EyeIcon aria-hidden="true" className="size-5" />
                )}
              </button>
            </div>
          </label>

          {currentError ? (
            <div className="animate-soft-pop rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {currentError}
            </div>
          ) : null}

          <div className="animate-fade-up animate-delay-4 pt-1 text-center">
            <button
              type="button"
              className="interactive-lift text-sm font-semibold text-emerald-900 hover:text-emerald-700"
            >
              He perdido mi contraseña
            </button>
          </div>

          <Button
            className="interactive-lift animate-fade-up animate-delay-5 mt-5 w-full rounded-full bg-slate-950 py-4 text-base text-white shadow-[0_18px_44px_rgba(15,23,42,0.2)] hover:bg-emerald-950"
            isLoading={isSubmitting}
            type="submit"
            variant="secondary"
          >
            Iniciar sesion
          </Button>
        </form>

        <div className="animate-fade-up animate-delay-5 mt-9 flex items-center gap-4 text-sm font-medium text-slate-500">
          <span className="h-px flex-1 bg-slate-300/80" />
          <span>o continuar con</span>
          <span className="h-px flex-1 bg-slate-300/80" />
        </div>

        <div className="mt-6 flex justify-center gap-8">
          <button
            type="button"
            aria-label="Continuar con correo electronico"
            className="interactive-lift animate-soft-pop animate-delay-4 grid size-14 place-items-center rounded-full bg-white/80 text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.1)] hover:bg-white"
          >
            <EnvelopeIcon aria-hidden="true" className="size-6" />
          </button>
          <button
            type="button"
            aria-label="Continuar con Google"
            className="interactive-lift animate-soft-pop animate-delay-5 grid size-14 place-items-center rounded-full bg-white/80 shadow-[0_12px_30px_rgba(15,23,42,0.1)] hover:bg-white"
          >
            <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24">
              <path
                d="M21.6 12.23c0-.74-.07-1.45-.2-2.13H12v4.03h5.37a4.6 4.6 0 0 1-1.99 3.02v2.51h3.22c1.89-1.74 3-4.3 3-7.43Z"
                fill="#4285F4"
              />
              <path
                d="M12 22c2.7 0 4.96-.89 6.6-2.34l-3.22-2.51c-.9.6-2.04.95-3.38.95-2.6 0-4.8-1.76-5.58-4.12H3.1v2.6A9.98 9.98 0 0 0 12 22Z"
                fill="#34A853"
              />
              <path
                d="M6.42 13.98a6.02 6.02 0 0 1 0-3.96v-2.6H3.1a9.98 9.98 0 0 0 0 9.16l3.32-2.6Z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.9c1.47 0 2.78.5 3.82 1.5l2.85-2.85C16.95 2.94 14.7 2 12 2a9.98 9.98 0 0 0-8.9 5.42l3.32 2.6C7.2 7.66 9.4 5.9 12 5.9Z"
                fill="#EA4335"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Continuar con Apple"
            className="interactive-lift animate-soft-pop animate-delay-6 grid size-14 place-items-center rounded-full bg-white/80 text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.1)] hover:bg-white"
          >
            <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.41 12.68c-.03-2.48 2.03-3.68 2.12-3.74-1.16-1.7-2.97-1.93-3.6-1.96-1.53-.16-2.99.9-3.77.9-.77 0-1.96-.88-3.23-.85-1.66.02-3.2.97-4.06 2.46-1.73 3-.44 7.45 1.25 9.88.82 1.2 1.8 2.54 3.09 2.49 1.24-.05 1.71-.8 3.21-.8s1.92.8 3.23.78c1.33-.03 2.18-1.22 3-2.42.95-1.39 1.34-2.74 1.36-2.8-.03-.02-2.57-.98-2.6-3.94ZM13.93 5.36c.69-.84 1.15-2 1.03-3.16-.99.04-2.19.66-2.9 1.5-.64.74-1.2 1.93-1.05 3.07 1.1.09 2.23-.56 2.92-1.41Z" />
            </svg>
          </button>
        </div>
      </section>

      <footer className="animate-fade-up animate-delay-6 relative z-10 flex min-h-10 flex-wrap items-center gap-4 text-sm font-medium text-slate-500 sm:gap-8">
        <button type="button" className="interactive-lift flex items-center gap-2 hover:text-slate-900">
          <span className="grid size-6 place-items-center rounded-full bg-red-500 text-[10px] font-black text-white">
            PY
          </span>
          <span>Español</span>
          <ChevronDownIcon aria-hidden="true" className="size-4" />
        </button>
        <button type="button" className="interactive-lift hover:text-slate-900">
          Politica de privacidad - Julian Arambulo
        </button>
      </footer>
    </main>
  )
}
