import { useState } from 'react'
import {
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

import { LandingPage } from './components/auth/LandingPage'
import { LoginScreen } from './components/auth/LoginScreen'
import { InvoiceTable } from './components/invoices/InvoiceTable'
import { InvoicesMonitoringView } from './components/invoices/InvoicesMonitoringView'
import { UploadForm } from './components/invoices/UploadForm'
import { Navbar } from './components/layout/navbar'
import { PaymentInstallmentPlanner } from './components/payments/PaymentInstallmentPlanner'
import { useInvoices } from './hooks/useInvoices'
import { useTempAuth } from './hooks/useTempAuth'
import type { AuthUser } from './types/auth'
import type { InvoiceFilter } from './types/invoice'
import type { InstallmentPaymentItem } from './types/payment'

type AppView = 'aliado' | 'alianzas'
type PreLoginView = 'landing' | 'login'

const filterLabels: Record<InvoiceFilter, string> = {
  all: 'Todas',
  mine: 'Subidas por mi',
  pending: 'Pendientes',
}

function getDefaultView(user: AuthUser): AppView {
  return user.role === 'Alianzas' ? 'alianzas' : 'aliado'
}

function formatCompactCurrency(amount: number) {
  return new Intl.NumberFormat('es-PY', {
    currency: 'PYG',
    maximumFractionDigits: 0,
    notation: amount >= 1_000_000 ? 'compact' : 'standard',
    style: 'currency',
  }).format(amount)
}

function AuthenticatedApp({
  onLogout,
  user,
}: {
  onLogout: () => void
  user: AuthUser
}) {
  const [activeView, setActiveView] = useState<AppView>(getDefaultView(user))

  const {
    error,
    filteredInvoices,
    filter,
    invoices,
    isLoading,
    isSubmitting,
    rejectInvoice,
    setFilter,
    uploadInvoice,
    verifyInvoice,
  } = useInvoices({
    role: user.role,
    userId: user.id,
  })

  const availableFilters: InvoiceFilter[] = ['mine', 'all']
  const userInvoices = invoices.filter((invoice) => invoice.aliado_id === user.id)
  const pendingUserInvoices = userInvoices.filter((invoice) => invoice.estado === 'Pendiente')
  const verifiedUserInvoices = userInvoices.filter((invoice) => invoice.estado === 'Verificado')
  const userInvoiceAmount = userInvoices.reduce((total, invoice) => total + invoice.monto, 0)
  const installmentPayments: InstallmentPaymentItem[] = pendingUserInvoices.map((invoice) => ({
    amount: invoice.monto,
    id: invoice.id,
    label: `${invoice.comercio} · ${invoice.nro_factura}`,
    month: new Intl.DateTimeFormat('es-PY', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(invoice.fecha_subida)),
  }))
  const dashboardStats = [
    {
      icon: DocumentTextIcon,
      label: 'Cargadas',
      value: String(userInvoices.length),
    },
    {
      icon: ClockIcon,
      label: 'Pendientes',
      value: String(pendingUserInvoices.length),
    },
    {
      icon: CheckCircleIcon,
      label: 'Verificadas',
      value: String(verifiedUserInvoices.length),
    },
    {
      icon: BanknotesIcon,
      label: 'Monto total',
      value: formatCompactCurrency(userInvoiceAmount),
    },
  ]

  const handleChangeView = (view: AppView) => {
    if (user.role === 'Aliado' && view !== 'aliado') {
      return
    }

    if (user.role === 'Alianzas' && view !== 'alianzas') {
      return
    }

    setActiveView(view)
    setFilter(view === 'aliado' ? 'mine' : 'all')
  }

  const handleScrollToUpload = () => {
    document
      .getElementById('upload-invoice-form')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="app-shell min-h-screen py-8 text-slate-900 sm:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <Navbar
          activeView={activeView}
          onChangeView={handleChangeView}
          onLogout={onLogout}
          userName={user.name}
          userRole={user.role}
        />

        <section className="surface-shine animate-fade-up animate-delay-1 overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white/78 px-6 py-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.26em] text-emerald-800">
                {activeView === 'aliado' ? 'Portal del Aliado' : 'Monitoreo de Pagos'}
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-normal text-slate-950 sm:text-5xl">
                {activeView === 'aliado'
                  ? 'Carga evidencias y controla tus pagos pendientes en un solo lugar.'
                  : 'Supervisa cada pago pendiente cargado para tus aliados.'}
              </h1>
              <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600">
                {activeView === 'aliado'
                  ? 'Un flujo simple para subir evidencias, revisar pendientes y mantener trazabilidad sin ruido.'
                  : 'Filtros claros, estado visible y acciones rapidas para que el equipo de alianzas avance sin friccion.'}
              </p>
            </div>

            <div className="interactive-lift rounded-2xl border border-emerald-950/10 bg-emerald-50/70 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
                Sesion activa
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-full bg-emerald-500 text-base font-black text-emerald-950">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">{user.role}</p>
                  <p className="text-lg font-black text-slate-950">{user.name}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {activeView === 'aliado' ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {dashboardStats.map((stat, index) => {
                const Icon = stat.icon
                const delayClass = [
                  'animate-delay-2',
                  'animate-delay-3',
                  'animate-delay-4',
                  'animate-delay-5',
                ][index]

                return (
                  <article
                    key={stat.label}
                    className={`surface-shine interactive-lift animate-soft-pop ${delayClass} rounded-2xl border border-emerald-950/10 bg-white/76 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)] backdrop-blur`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                        <p className="mt-2 text-2xl font-black text-slate-950">{stat.value}</p>
                      </div>
                      <div className="grid size-11 place-items-center rounded-full bg-emerald-50 text-emerald-900">
                        <Icon aria-hidden="true" className="size-5" />
                      </div>
                    </div>
                  </article>
                )
              })}
            </section>

            <PaymentInstallmentPlanner payments={installmentPayments} />

            <section className="grid gap-8 lg:grid-cols-[390px_minmax(0,1fr)]">
              <UploadForm aliadoId={user.id} isSubmitting={isSubmitting} onUpload={uploadInvoice} />

              <div className="animate-fade-up animate-delay-3 space-y-6 rounded-[2rem] border border-emerald-950/10 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.07)] backdrop-blur">
                <div className="flex flex-col gap-4 border-b border-emerald-950/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-950">Mis pagos</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Revisa tus evidencias recientes y el estado de validacion.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 rounded-full bg-slate-100 p-1">
                    {availableFilters.map((option) => {
                      const isActive = filter === option

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFilter(option)}
                          className={`interactive-lift rounded-full px-4 py-2 text-sm font-bold ${
                            isActive
                              ? 'bg-emerald-500 text-emerald-950 shadow-sm'
                              : 'text-slate-500 hover:text-slate-950'
                          }`}
                        >
                          {filterLabels[option]}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {error ? (
                  <div className="animate-soft-pop rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {error}
                  </div>
                ) : null}

                <InvoiceTable
                  invoices={filteredInvoices}
                  isLoading={isLoading}
                  onEmptyAction={handleScrollToUpload}
                  userRole={user.role}
                />
              </div>
            </section>
          </>
        ) : (
          <InvoicesMonitoringView
            error={error}
            invoices={invoices}
            isLoading={isLoading}
            onReject={rejectInvoice}
            onVerify={verifyInvoice}
          />
        )}
      </div>
    </main>
  )
}

function App() {
  const [preLoginView, setPreLoginView] = useState<PreLoginView>('landing')
  const {
    demoAccounts,
    error,
    isAuthenticated,
    isSubmitting,
    login,
    logout,
    user,
  } = useTempAuth()

  const handleLogout = () => {
    logout()
    setPreLoginView('landing')
  }

  if (!isAuthenticated || !user) {
    if (preLoginView === 'landing') {
      return (
        <LandingPage
          onGetStarted={() => setPreLoginView('login')}
          onSignIn={() => setPreLoginView('login')}
        />
      )
    }

    return (
      <LoginScreen
        demoAccounts={demoAccounts}
        error={error}
        isSubmitting={isSubmitting}
        onBackToLanding={() => setPreLoginView('landing')}
        onLogin={login}
      />
    )
  }

  return <AuthenticatedApp onLogout={handleLogout} user={user} />
}

export default App
