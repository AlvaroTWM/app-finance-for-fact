import {
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

import { AllyDetailPage } from './components/allies/AllyDetailPage'
import { AlliesPaymentsView } from './components/allies/AlliesPaymentsView'
import { LandingPage } from './components/auth/LandingPage'
import { LoginScreen } from './components/auth/LoginScreen'
import { Navbar } from './components/layout/navbar'
import { useAllies } from './hooks/useAllies'
import { useDarkMode } from './hooks/useDarkMode'
import { useSessionContext } from './hooks/useSessionContext'
import type { AuthUser } from './types/auth'

type AuthView = 'landing' | 'login' | 'session'

function formatCompactCurrency(amount: number) {
  return new Intl.NumberFormat('es-PY', {
    currency: 'PYG',
    maximumFractionDigits: 0,
    notation: amount >= 1_000_000 ? 'compact' : 'standard',
    style: 'currency',
  }).format(amount)
}

function SessionGate({
  error,
  isLoading,
}: {
  error: string | null
  isLoading: boolean
}) {
  return (
    <main className="app-shell grid min-h-screen place-items-center px-5 py-8 text-slate-950">
      <section className="surface-shine w-full max-w-xl rounded-[2rem] border border-emerald-950/10 bg-white/85 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-800">
          Loyalty Pagos
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
          {isLoading ? 'Validando acceso corporativo' : 'Acceso restringido'}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          {isLoading
            ? 'Estamos comprobando tu sesion de Google dentro del entorno de Apps Script.'
            : error || 'No pudimos validar tu acceso a esta aplicacion.'}
        </p>
      </section>
    </main>
  )
}

function AuthenticatedApp({
  onLogout,
  user,
}: {
  onLogout: () => void
  user: AuthUser
}) {
  const { isDark, toggle: toggleDark } = useDarkMode()
  const {
    addCuota,
    allies,
    createAgreement,
    error,
    isDetailLoading,
    isLoading,
    registerPayment,
    refetch,
    selectedAllyDetail,
    selectedAllyId,
    selectAlly,
  } = useAllies()

  const [appView, setAppView] = useState<'list' | 'detail'>('list')

  const handleSelectAlly = async (allyId: string | number) => {
    await selectAlly(allyId)
    setAppView('detail')
  }

  const handleBackToList = () => {
    setAppView('list')
  }

  const pendingAllies = allies.filter((ally) => ally.estado_general === 'pendiente')
  const partialAllies = allies.filter((ally) => ally.estado_general === 'parcial')
  const totalOutstandingBalance = allies.reduce((total, ally) => total + ally.saldo_pendiente, 0)
  const dashboardStats = [
    {
      icon: DocumentTextIcon,
      label: 'Aliados',
      value: String(allies.length),
    },
    {
      icon: ClockIcon,
      label: 'Pendientes',
      value: String(pendingAllies.length),
    },
    {
      icon: CheckCircleIcon,
      label: 'Parciales',
      value: String(partialAllies.length),
    },
    {
      icon: BanknotesIcon,
      label: 'Saldo pendiente',
      value: formatCompactCurrency(totalOutstandingBalance),
    },
  ]

  return (
    <main className="app-shell min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      {/* Navbar sticky */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-900">
        <Navbar isDark={isDark} onLogout={onLogout} onToggleDark={toggleDark} userName={user.name} userRole={user.role} />
      </div>

      <div className="mx-auto flex w-full max-w-[92vw] flex-col gap-5 px-2 py-6">

        {/* Hero compacto + stats — solo en la vista lista */}
        {appView !== 'detail' && <section className="animate-fade-up animate-delay-1 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
          {/* Texto */}
          <div className="flex-1">
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-emerald-700 dark:text-emerald-400">
              Panel operativo
            </p>
            <h1 className="mt-1 text-2xl font-black leading-tight text-slate-950 dark:text-white sm:text-3xl">
              Centraliza el seguimiento de deuda, cuotas y pagos de tus aliados.
            </h1>
            <p className="mt-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
              Todo el equipo puede entrar al detalle de cada aliado desde una sola vista y ver el saldo real sin depender del caos manual.
            </p>
          </div>

          {/* Stats inline */}
          <div className="flex shrink-0 flex-wrap gap-3 lg:flex-nowrap">
            {dashboardStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="flex min-w-[130px] items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400">
                    <Icon aria-hidden="true" className="size-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">{stat.label}</p>
                    <p className="text-lg font-black text-slate-950 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Sesion activa compacta */}
          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-100 bg-emerald-50/60 px-4 py-3 dark:border-slate-700 dark:bg-emerald-900/20">
            <div className="grid size-9 place-items-center rounded-full bg-emerald-500 text-sm font-black text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">{user.role}</p>
              <p className="text-sm font-black text-slate-950 dark:text-white">{user.name}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">{user.email}</p>
            </div>
          </div>
          </section>}

        {/* Vista condicional: lista o detalle */}
        {appView === 'detail' && selectedAllyDetail ? (
          <AllyDetailPage
            allyDetail={selectedAllyDetail}
            isLoading={isDetailLoading}
            onAddCuota={addCuota}
            onBack={handleBackToList}
            onRegisterPayment={registerPayment}
          />
        ) : (
          <AlliesPaymentsView
            allies={allies}
            error={error}
            isDetailLoading={isDetailLoading}
            isLoading={isLoading}
            onAddCuota={addCuota}
            onCreateAgreement={createAgreement}
            onRegisterPayment={registerPayment}
            onRefresh={refetch}
            onSelectAlly={handleSelectAlly}
            selectedAllyDetail={selectedAllyDetail}
            selectedAllyId={selectedAllyId}
          />
        )}

      </div>
    </main>
  )
}

const corporateLoginCopy = {
  buttonLabel: 'Continuar con cuenta corporativa',
  description:
    'Usaremos tu sesion activa de Google Workspace para validar el acceso al panel de Alianzas.',
  helperText:
    'No se abre OAuth externo: Apps Script valida tu cuenta y pertenencia al grupo autorizado.',
  title: 'Validar acceso corporativo',
}

function SessionApp({
  onBackToLanding,
  onLogout,
  onRetrySession,
}: {
  onBackToLanding: () => void
  onLogout: () => void
  onRetrySession: () => Promise<void>
}) {
  const { error, isAuthenticated, isLoading, user } = useSessionContext()

  if (isLoading) {
    return <SessionGate error={error} isLoading={isLoading} />
  }

  if (!isAuthenticated || !user) {
    return (
      <LoginScreen
        {...corporateLoginCopy}
        error={error}
        isGoogleLoginConfigured
        onBackToLanding={onBackToLanding}
        onGoogleLogin={onRetrySession}
      />
    )
  }

  return <AuthenticatedApp onLogout={onLogout} user={user} />
}

function App() {
  const [authView, setAuthView] = useState<AuthView>('landing')
  const [sessionAttempt, setSessionAttempt] = useState(0)

  const showLogin = () => {
    setAuthView('login')
  }

  const startSessionValidation = async () => {
    setSessionAttempt((currentAttempt) => currentAttempt + 1)
    setAuthView('session')
  }

  const backToLanding = () => {
    setAuthView('landing')
  }

  const logoutToLanding = () => {
    setSessionAttempt((currentAttempt) => currentAttempt + 1)
    setAuthView('landing')
  }

  if (authView === 'landing') {
    return <LandingPage onGetStarted={showLogin} onSignIn={showLogin} />
  }

  if (authView === 'login') {
    return (
      <LoginScreen
        {...corporateLoginCopy}
        isGoogleLoginConfigured
        onBackToLanding={backToLanding}
        onGoogleLogin={startSessionValidation}
      />
    )
  }

  return (
    <SessionApp
      key={sessionAttempt}
      onBackToLanding={backToLanding}
      onLogout={logoutToLanding}
      onRetrySession={startSessionValidation}
    />
  )
}

export default App
