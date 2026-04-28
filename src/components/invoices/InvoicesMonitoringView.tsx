import { useMemo, useState } from 'react'

import { InvoiceTable } from './InvoiceTable'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { PendingPaymentsImport } from '../payments/PendingPaymentsImport'
import { invoiceStatuses } from '../../types/invoice'
import type { Invoice, InvoiceStatus } from '../../types/invoice'

interface InvoicesMonitoringViewProps {
  error?: string | null
  invoices: Invoice[]
  isLoading?: boolean
  onReject: (invoiceId: string) => Promise<Invoice>
  onVerify: (invoiceId: string) => Promise<Invoice>
}

function getMonthKey(date: string) {
  const parsedDate = new Date(date)
  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function getMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split('-')
  const parsedDate = new Date(Number(year), Number(month) - 1)

  return new Intl.DateTimeFormat('es-PY', {
    month: 'long',
    year: 'numeric',
  }).format(parsedDate)
}

export function InvoicesMonitoringView({
  error = null,
  invoices,
  isLoading = false,
  onReject,
  onVerify,
}: InvoicesMonitoringViewProps) {
  const [commerceFilter, setCommerceFilter] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | 'all'>('all')

  const commerceOptions = useMemo(
    () =>
      Array.from(
        new Set(
          invoices
            .map((invoice) => invoice.comercio)
            .filter(Boolean)
            .sort((left, right) => left.localeCompare(right)),
        ),
      ),
    [invoices],
  )

  const monthOptions = useMemo(
    () =>
      Array.from(new Set(invoices.map((invoice) => getMonthKey(invoice.fecha_subida)))).sort(
        (left, right) => right.localeCompare(left),
      ),
    [invoices],
  )

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesCommerce = commerceFilter
        ? invoice.comercio.toLowerCase().includes(commerceFilter.toLowerCase())
        : true
      const matchesMonth =
        selectedMonth === 'all' ? true : getMonthKey(invoice.fecha_subida) === selectedMonth
      const matchesStatus = selectedStatus === 'all' ? true : invoice.estado === selectedStatus

      return matchesCommerce && matchesMonth && matchesStatus
    })
  }, [commerceFilter, invoices, selectedMonth, selectedStatus])

  const totalAmount = useMemo(
    () => filteredInvoices.reduce((accumulator, invoice) => accumulator + invoice.monto, 0),
    [filteredInvoices],
  )

  const pendingInvoices = filteredInvoices.filter((invoice) => invoice.estado === 'Pendiente').length
  const verifiedInvoices = filteredInvoices.filter((invoice) => invoice.estado === 'Verificado').length
  const rejectedInvoices = filteredInvoices.filter((invoice) => invoice.estado === 'Rechazado').length

  return (
    <section className="animate-fade-up animate-delay-2 space-y-6 rounded-[2rem] border border-emerald-950/10 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.07)] backdrop-blur">
      <PendingPaymentsImport />

      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Vista de Alianzas
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            Monitorea todos los pagos pendientes
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Filtra por comercio, estado o fecha y toma accion sobre cada evidencia.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="surface-shine interactive-lift animate-soft-pop animate-delay-2 rounded-2xl bg-emerald-50/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Visibles</p>
            <p className="mt-2 text-2xl font-black text-slate-950">{filteredInvoices.length}</p>
          </div>
          <div className="surface-shine interactive-lift animate-soft-pop animate-delay-3 rounded-2xl bg-emerald-50/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Pendientes</p>
            <p className="mt-2 text-2xl font-black text-amber-600">{pendingInvoices}</p>
          </div>
          <div className="surface-shine interactive-lift animate-soft-pop animate-delay-4 rounded-2xl bg-emerald-50/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Aprobadas</p>
            <p className="mt-2 text-2xl font-black text-emerald-700">{verifiedInvoices}</p>
          </div>
          <div className="surface-shine interactive-lift animate-soft-pop animate-delay-5 rounded-2xl bg-emerald-50/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Rechazadas</p>
            <p className="mt-2 text-2xl font-black text-rose-600">{rejectedInvoices}</p>
          </div>
        </div>
      </div>

      <div className="animate-fade-up animate-delay-4 rounded-3xl border border-emerald-950/10 bg-emerald-50/40 p-4">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
              Filtros
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Usa pocos filtros para encontrar rapido los pagos que requieren accion.
            </p>
          </div>
          <p className="text-sm font-black text-slate-950">
            Monto visible:{' '}
            {new Intl.NumberFormat('es-PY', {
              style: 'currency',
              currency: 'PYG',
              maximumFractionDigits: 0,
            }).format(totalAmount)}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Input
            id="commerceFilter"
            label="Comercio"
            list="commerce-options"
            onChange={(event) => setCommerceFilter(event.target.value)}
            placeholder="Buscar comercio"
            value={commerceFilter}
          />
          <datalist id="commerce-options">
            {commerceOptions.map((commerce) => (
              <option key={commerce} value={commerce} />
            ))}
          </datalist>

          <Select
            id="statusFilter"
            label="Estado"
            onChange={(event) => setSelectedStatus(event.target.value as InvoiceStatus | 'all')}
            value={selectedStatus}
          >
            <option value="all">Todos los estados</option>
            {invoiceStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>

          <Select
            id="monthFilter"
            label="Fecha"
            onChange={(event) => setSelectedMonth(event.target.value)}
            value={selectedMonth}
          >
            <option value="all">Todas las fechas</option>
            {monthOptions.map((monthKey) => (
              <option key={monthKey} value={monthKey}>
                {getMonthLabel(monthKey)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {error ? (
        <div className="animate-soft-pop rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <InvoiceTable
        invoices={filteredInvoices}
        isLoading={isLoading}
        onReject={onReject}
        onVerify={onVerify}
        userRole="Alianzas"
      />
    </section>
  )
}
