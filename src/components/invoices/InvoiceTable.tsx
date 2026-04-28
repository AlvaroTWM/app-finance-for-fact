import { useState } from 'react'
import { InboxIcon } from '@heroicons/react/24/outline'

import { Button } from '../ui/Button'
import type { Invoice, UserRole } from '../../types/invoice'

interface InvoiceTableProps {
  invoices: Invoice[]
  isLoading?: boolean
  onEmptyAction?: () => void
  onReject?: (invoiceId: string) => Promise<Invoice>
  onVerify?: (invoiceId: string) => Promise<Invoice>
  userRole: UserRole
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-PY', {
    currency: 'PYG',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(amount)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-PY', {
    dateStyle: 'medium',
  }).format(new Date(date))
}

export function InvoiceTable({
  invoices,
  isLoading = false,
  onEmptyAction,
  onReject,
  onVerify,
  userRole,
}: InvoiceTableProps) {
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)

  const handleVerify = async (invoiceId: string) => {
    if (!onVerify) {
      return
    }

    try {
      setVerifyingId(invoiceId)
      await onVerify(invoiceId)
    } finally {
      setVerifyingId(null)
    }
  }

  const handleReject = async (invoiceId: string) => {
    if (!onReject) {
      return
    }

    try {
      setRejectingId(invoiceId)
      await onReject(invoiceId)
    } finally {
      setRejectingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="animate-soft-pop rounded-2xl border border-dashed border-emerald-950/15 bg-emerald-50/45 px-6 py-14 text-center text-sm font-medium text-slate-500">
        Preparando tus facturas...
      </div>
    )
  }

  if (invoices.length === 0) {
    const isAlianzasView = userRole === 'Alianzas'

    return (
      <div className="animate-soft-pop rounded-2xl border border-dashed border-emerald-950/15 bg-emerald-50/45 px-6 py-14 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-white text-emerald-900 shadow-sm">
          <InboxIcon aria-hidden="true" className="size-6" />
        </div>
        <p className="mt-4 text-base font-black text-slate-950">
          {isAlianzasView ? 'Aun no hay facturas cargadas' : 'Subi tu primera factura'}
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-6 text-slate-500">
          {isAlianzasView
            ? 'Cuando los aliados carguen comprobantes, apareceran aca para aprobarlos o rechazarlos.'
            : 'Carga un comprobante para enviarlo a validacion y hacer seguimiento desde este panel.'}
        </p>
        {isAlianzasView ? (
          <span className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-emerald-800 shadow-sm">
            Esperando carga de aliados
          </span>
        ) : (
          <Button className="interactive-lift mt-5" onClick={onEmptyAction}>
            Subi tu primera factura
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="animate-fade-up overflow-hidden rounded-2xl border border-emerald-950/10">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-emerald-50/70 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Comercio</th>
              <th className="px-4 py-3 font-medium">Monto</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Factura</th>
              <th className="px-4 py-3 font-medium">Imagen</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {invoices.map((invoice, index) => {
              const canVerify =
                userRole === 'Alianzas' && invoice.estado === 'Pendiente' && Boolean(onVerify)
              const canReject =
                userRole === 'Alianzas' && invoice.estado === 'Pendiente' && Boolean(onReject)
              const delayClass =
                index % 3 === 0
                  ? 'animate-delay-1'
                  : index % 3 === 1
                    ? 'animate-delay-2'
                    : 'animate-delay-3'

              return (
                <tr key={invoice.id} className={`animate-fade-up ${delayClass}`}>
                  <td className="px-4 py-4">
                    <p className="font-black text-slate-950">{invoice.comercio}</p>
                    <p className="mt-1 text-xs text-slate-400">Aliado: {invoice.aliado_id}</p>
                  </td>
                  <td className="px-4 py-4">{formatCurrency(invoice.monto)}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        invoice.estado === 'Verificado'
                          ? 'bg-emerald-100 text-emerald-700'
                          : invoice.estado === 'Rechazado'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {invoice.estado}
                    </span>
                  </td>
                  <td className="px-4 py-4">{formatDate(invoice.fecha_subida)}</td>
                  <td className="px-4 py-4 font-medium text-slate-950">{invoice.nro_factura}</td>
                  <td className="px-4 py-4">
                    <a
                      className="font-medium text-emerald-700 hover:text-emerald-600"
                      href={invoice.url_imagen}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Ver detalle
                    </a>
                  </td>
                  <td className="px-4 py-4">
                    {canVerify ? (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          className="interactive-lift"
                          isLoading={verifyingId === invoice.id}
                          onClick={() => void handleVerify(invoice.id)}
                          variant="secondary"
                        >
                          Aprobar
                        </Button>
                        {canReject ? (
                          <Button
                            className="interactive-lift border border-rose-200 text-rose-700 hover:bg-rose-50"
                            isLoading={rejectingId === invoice.id}
                            onClick={() => void handleReject(invoice.id)}
                            variant="ghost"
                          >
                            Rechazar
                          </Button>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Sin acciones</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
