import { useMemo, useState } from 'react'
import { BanknotesIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'

import type { InstallmentPaymentItem } from '../../types/payment'

interface PaymentInstallmentPlannerProps {
  payments: InstallmentPaymentItem[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-PY', {
    currency: 'PYG',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(amount)
}

export function PaymentInstallmentPlanner({ payments }: PaymentInstallmentPlannerProps) {
  const [selectedPaymentId, setSelectedPaymentId] = useState('all')
  const [installments, setInstallments] = useState(3)

  const selectedPayments = useMemo(() => {
    if (selectedPaymentId === 'all') {
      return payments
    }

    return payments.filter((payment) => payment.id === selectedPaymentId)
  }, [payments, selectedPaymentId])

  const totalAmount = selectedPayments.reduce((total, payment) => total + payment.amount, 0)
  const installmentAmount = installments > 0 ? totalAmount / installments : 0

  return (
    <section className="animate-fade-up animate-delay-2 rounded-[2rem] border border-emerald-950/10 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.07)] backdrop-blur">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">
            Fraccionador
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-normal text-slate-950">
            Planifica tus pagos pendientes
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
            Selecciona uno o varios pagos asignados y simula un fraccionamiento de hasta 12 cuotas.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-emerald-50/80 px-4 py-3">
            <div className="flex items-center gap-2 text-emerald-900">
              <BanknotesIcon aria-hidden="true" className="size-5" />
              <p className="text-xs font-black uppercase tracking-[0.14em]">Total</p>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-950">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
            <div className="flex items-center gap-2 text-emerald-200">
              <CalendarDaysIcon aria-hidden="true" className="size-5" />
              <p className="text-xs font-black uppercase tracking-[0.14em]">Cuota estimada</p>
            </div>
            <p className="mt-2 text-2xl font-black">{formatCurrency(installmentAmount)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
        <label className="flex flex-col gap-2 text-sm font-bold text-slate-700">
          Pago pendiente
          <select
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            onChange={(event) => setSelectedPaymentId(event.target.value)}
            value={selectedPaymentId}
          >
            <option value="all">Todos los pagos pendientes</option>
            {payments.map((payment) => (
              <option key={payment.id} value={payment.id}>
                {payment.label} - {payment.month}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-bold text-slate-700">
          Cantidad de cuotas
          <select
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            onChange={(event) => setInstallments(Number(event.target.value))}
            value={installments}
          >
            {Array.from({ length: 12 }, (_, index) => index + 1).map((installment) => (
              <option key={installment} value={installment}>
                {installment} {installment === 1 ? 'cuota' : 'cuotas'}
              </option>
            ))}
          </select>
        </label>
      </div>

      {payments.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-emerald-950/15 bg-emerald-50/45 px-4 py-5 text-sm font-medium text-slate-500">
          Aun no tienes pagos pendientes asignados por Alianzas. Cuando se cargue el Excel, vas a
          poder fraccionarlos desde aca.
        </div>
      ) : (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {selectedPayments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-2xl border border-emerald-950/10 bg-white/70 px-4 py-3"
            >
              <p className="text-sm font-black text-slate-950">{payment.label}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{payment.month}</p>
              <p className="mt-2 text-base font-black text-emerald-800">
                {formatCurrency(payment.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
