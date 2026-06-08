import { ArrowLeftIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

import { Button } from '../ui/Button'

interface LoginScreenProps {
  buttonLabel?: string
  configurationErrorMessage?: string
  description?: string
  error?: string | null
  helperText?: string
  isGoogleLoginConfigured: boolean
  isSubmitting?: boolean
  onBackToLanding: () => void
  onGoogleLogin: () => Promise<unknown>
  title?: string
}

export function LoginScreen({
  buttonLabel = 'Continuar con Google',
  configurationErrorMessage = 'Falta configurar VITE_GOOGLE_CLIENT_ID para habilitar el acceso con Google.',
  description = 'Accede al panel interno de Alianzas con tu cuenta de Google del dominio ITTI.',
  error = null,
  helperText = 'Google mostrara el selector de cuenta y el consentimiento de la sesion.',
  isGoogleLoginConfigured,
  isSubmitting = false,
  onBackToLanding,
  onGoogleLogin,
  title = 'Iniciar sesion con Google',
}: LoginScreenProps) {
  const currentError =
    error ??
    (isGoogleLoginConfigured ? null : configurationErrorMessage)

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
          <p className="mx-auto mt-4 max-w-[420px] text-base leading-7 text-slate-600">
            {description}
          </p>
        </div>

        <div className="mt-10 animate-soft-pop animate-delay-2 rounded-[2rem] border border-emerald-900/10 bg-white/80 p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
              <svg aria-hidden="true" className="size-8" viewBox="0 0 24 24">
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
            </div>

            <h2 className="mt-6 text-2xl font-black text-slate-950">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              El acceso se habilita solo para cuentas activas del dominio <strong>itti.digital</strong>.
            </p>

            {currentError ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {currentError}
              </div>
            ) : null}

            <Button
              className="interactive-lift mt-7 w-full rounded-full bg-slate-950 py-4 text-base text-white shadow-[0_18px_44px_rgba(15,23,42,0.2)] hover:bg-emerald-950"
              disabled={!isGoogleLoginConfigured}
              isLoading={isSubmitting}
              onClick={() => void onGoogleLogin()}
              type="button"
              variant="secondary"
            >
              {buttonLabel}
            </Button>

            <p className="mt-4 text-xs font-medium leading-5 text-slate-500">
              {helperText}
            </p>
          </div>
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
