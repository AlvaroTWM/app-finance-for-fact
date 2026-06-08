import { ArrowLeftIcon, BanknotesIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

import type {
  AgregarCuotaPayload,
  AliadoDetalle,
  CuotaRecord,
  RegistrarPagoPayload,
} from '../../types/appScript'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

interface AllyDetailPageProps {
  allyDetail: AliadoDetalle
  isLoading?: boolean
  onAddCuota: (payload: AgregarCuotaPayload) => Promise<void>
  onBack: () => void
  onRegisterPayment: (payload: RegistrarPagoPayload) => Promise<void>
}

const today = new Date().toISOString().slice(0, 10)

function formatCurrency(n: number) {
  return new Intl.NumberFormat('es-PY', {
    currency: 'PYG',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(n)
}

function formatDate(d?: string) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('es-PY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const estadoBadge: Record<string, string> = {
  pagada:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  parcial:  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  pendiente:'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
}

function CuotaCard({
  cuota,
  deudaLabel,
  onPay,
}: {
  cuota: CuotaRecord
  deudaLabel: string
  onPay: (cuotaId: string, deudaId: string, monto: number) => Promise<void>
}) {
  const [showPay, setShowPay] = useState(false)
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(today)
  const [medio, setMedio] = useState('')
  const [obs, setObs] = useState('')
  const [paying, setPaying] = useState(false)
  const [done, setDone] = useState(false)

  const saldo = cuota.monto_cuota - cuota.monto_pagado

  const handlePay = async () => {
    if (!monto || Number(monto) <= 0) return
    setPaying(true)
    try {
      await onPay(cuota.cuota_id, cuota.deuda_id, Number(monto))
      setMonto('')
      setDone(true)
      setShowPay(false)
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 dark:border-slate-700 dark:bg-slate-800">
      {/* Header cuota */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-black text-slate-950 dark:text-white">Cuota {cuota.numero_cuota}</span>
          <span className="text-[11px] text-slate-400 font-medium dark:text-slate-500">{deudaLabel}</span>
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-black uppercase tracking-wide ${estadoBadge[cuota.estado_cuota] ?? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
            {cuota.estado_cuota}
          </span>
        </div>
        {cuota.estado_cuota !== 'pagada' && (
          <button
            className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-emerald-900/30 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
            onClick={() => { setShowPay(v => !v); setDone(false) }}
            type="button"
          >
            {showPay ? 'Cancelar' : 'Registrar pago'}
          </button>
        )}
      </div>

      {/* Montos */}
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-700/50">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Monto cuota</p>
          <p className="font-black text-slate-950 dark:text-white">{formatCurrency(cuota.monto_cuota)}</p>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-700/50">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Pagado</p>
          <p className="font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(cuota.monto_pagado)}</p>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-700/50">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Saldo</p>
          <p className={`font-black ${saldo > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`}>{formatCurrency(Math.max(0, saldo))}</p>
        </div>
      </div>

      {/* Fecha */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
        <ClockIcon className="size-3.5" />
        <span>Vence: <span className="font-semibold text-slate-600 dark:text-slate-300">{formatDate(cuota.fecha_vencimiento)}</span></span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${Math.min(100, (cuota.monto_pagado / cuota.monto_cuota) * 100)}%` }}
        />
      </div>

      {/* Form pago */}
      {showPay && (
        <div className="border-t border-slate-100 pt-3 space-y-3 dark:border-slate-700">
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Registrar pago</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Input
              id={`pay-monto-${cuota.cuota_id}`}
              inputMode="decimal"
              label="Monto *"
              min="0"
              onChange={e => setMonto(e.target.value)}
              placeholder="Ej: 500000"
              type="number"
              value={monto}
            />
            <Input
              id={`pay-fecha-${cuota.cuota_id}`}
              label="Fecha pago *"
              onChange={e => setFecha(e.target.value)}
              type="date"
              value={fecha}
            />
            <Select
              id={`pay-medio-${cuota.cuota_id}`}
              label="Medio"
              onChange={e => setMedio(e.target.value)}
              value={medio}
            >
              <option value="">Sin especificar</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Cheque">Cheque</option>
            </Select>
          </div>
          <Input
            id={`pay-obs-${cuota.cuota_id}`}
            label="Observación"
            onChange={e => setObs(e.target.value)}
            placeholder="Opcional"
            value={obs}
          />
          <Button
            className="interactive-lift w-full"
            isLoading={paying}
            onClick={() => void handlePay()}
            type="button"
            variant="primary"
          >
            Confirmar pago — {monto ? formatCurrency(Number(monto)) : '—'}
          </Button>
        </div>
      )}

      {done && !showPay && (
        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Pago registrado.</p>
      )}
    </div>
  )
}

export function AllyDetailPage({
  allyDetail,
  isLoading = false,
  onAddCuota,
  onBack,
  onRegisterPayment,
}: AllyDetailPageProps) {
  const [addCuotaDeudaId, setAddCuotaDeudaId] = useState<string | null>(null)
  const [newCuotaMonto, setNewCuotaMonto] = useState('')
  const [newCuotaFecha, setNewCuotaFecha] = useState(today)
  const [addingCuota, setAddingCuota] = useState(false)

  const { aliado, cuotas, deudas, resumen } = allyDetail

  const handlePayCuota = async (cuotaId: string, deudaId: string, monto: number) => {
    await onRegisterPayment({
      aliadoId: String(aliado.aliado_id),
      cuotaId,
      deudaId,
      fechaPago: today,
      montoPagado: monto,
    })
  }

  const handleAddCuota = async () => {
    if (!addCuotaDeudaId || !newCuotaMonto) return
    setAddingCuota(true)
    try {
      await onAddCuota({
        deudaId: addCuotaDeudaId,
        fecha_pago: newCuotaFecha,
        monto_cuota: Number(newCuotaMonto),
      })
      setNewCuotaMonto('')
      setNewCuotaFecha(today)
      setAddCuotaDeudaId(null)
    } finally {
      setAddingCuota(false)
    }
  }

  const totalCuotas = cuotas.length
  const pagadas = cuotas.filter(c => c.estado_cuota === 'pagada').length
  const pendientes = cuotas.filter(c => c.estado_cuota === 'pendiente').length
  const parciales = cuotas.filter(c => c.estado_cuota === 'parcial').length

  return (
    <div className="flex w-full flex-col gap-5">

      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          onClick={onBack}
          type="button"
        >
          <ArrowLeftIcon className="size-4" />
          Volver
        </button>
        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Detalle del aliado</p>
          <p className="text-lg font-black text-slate-950 leading-tight dark:text-white">
            {aliado.nombre_aliado}
            <span className="ml-2 text-sm font-medium text-slate-400 dark:text-slate-500">ID {aliado.aliado_id}</span>
          </p>
        </div>
        <span className={`ml-auto inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest ${aliado.estado === 'activo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
          {aliado.estado}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Deuda total',  value: formatCurrency(resumen.deuda_total),           color: 'text-slate-950 dark:text-white' },
          { label: 'Pagado',       value: formatCurrency(resumen.monto_total_pagado),     color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Saldo',        value: formatCurrency(resumen.saldo_pendiente),        color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Cuotas',       value: `${pagadas}/${totalCuotas} pagadas`,            color: 'text-slate-700 dark:text-slate-300' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">{s.label}</p>
            <p className={`mt-1 text-lg font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Resumen cuotas pills */}
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">{totalCuotas} cuotas totales</span>
        {pagadas > 0  && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">{pagadas} pagadas</span>}
        {parciales > 0 && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">{parciales} parciales</span>}
        {pendientes > 0 && <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400">{pendientes} pendientes</span>}
      </div>

      {/* Cuotas por deuda */}
      {isLoading ? (
        <p className="text-sm text-slate-400 py-8 text-center dark:text-slate-500">Cargando cuotas...</p>
      ) : deudas.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500">
          Sin acuerdos registrados para este aliado.
        </div>
      ) : (
        deudas.map(deuda => {
          const cuotasDeuda = cuotas.filter(c => c.deuda_id === deuda.deuda_id)
          const isAddingHere = addCuotaDeudaId === deuda.deuda_id
          return (
            <section key={deuda.deuda_id} className="space-y-3">
              {/* Deuda header */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-black text-slate-950 dark:text-white">{deuda.deuda_id}</span>
                  {deuda.bolsa     && <span className="text-xs text-slate-500 dark:text-slate-400"><span className="font-semibold">Bolsa:</span> {deuda.bolsa}</span>}
                  {deuda.brand     && <span className="text-xs text-slate-500 dark:text-slate-400"><span className="font-semibold">Brand:</span> {deuda.brand}</span>}
                  {deuda.num_factura && <span className="text-xs text-slate-500 dark:text-slate-400"><span className="font-semibold">Factura:</span> {deuda.num_factura}</span>}
                  {deuda.periodo   && <span className="text-xs text-slate-500 dark:text-slate-400"><span className="font-semibold">Periodo:</span> {deuda.periodo}</span>}
                  {deuda.servicio  && <span className="text-xs text-slate-500 dark:text-slate-400"><span className="font-semibold">Servicio:</span> {deuda.servicio}</span>}
                  <span className="text-xs text-slate-400 dark:text-slate-500">Compromiso: {formatDate(deuda.fecha_compromiso)}</span>
                </div>
                <button
                  className="shrink-0 flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                  onClick={() => setAddCuotaDeudaId(isAddingHere ? null : deuda.deuda_id)}
                  type="button"
                >
                  <BanknotesIcon className="size-3.5" />
                  {isAddingHere ? 'Cancelar' : '+ Cuota'}
                </button>
              </div>

              {/* Form agregar cuota */}
              {isAddingHere && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-4 space-y-3 dark:border-emerald-800 dark:bg-emerald-900/20">
                  <p className="text-[11px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Nueva cuota para {deuda.deuda_id}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      id="new-cuota-monto"
                      inputMode="decimal"
                      label="Monto *"
                      min="0"
                      onChange={e => setNewCuotaMonto(e.target.value)}
                      placeholder="Ej: 500000"
                      type="number"
                      value={newCuotaMonto}
                    />
                    <Input
                      id="new-cuota-fecha"
                      label="Fecha de pago *"
                      onChange={e => setNewCuotaFecha(e.target.value)}
                      type="date"
                      value={newCuotaFecha}
                    />
                  </div>
                  <Button
                    className="interactive-lift"
                    isLoading={addingCuota}
                    onClick={() => void handleAddCuota()}
                    type="button"
                    variant="primary"
                  >
                    Agregar cuota
                  </Button>
                </div>
              )}

              {/* Cards de cuotas */}
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {cuotasDeuda.length === 0 ? (
                  <p className="col-span-3 text-sm text-slate-400 dark:text-slate-500">Sin cuotas para este acuerdo.</p>
                ) : (
                  cuotasDeuda
                    .sort((a, b) => a.numero_cuota - b.numero_cuota)
                    .map(cuota => (
                      <CuotaCard
                        key={cuota.cuota_id}
                        cuota={cuota}
                        deudaLabel={deuda.deuda_id}
                        onPay={handlePayCuota}
                      />
                    ))
                )}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}
