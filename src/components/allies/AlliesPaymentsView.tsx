import { useMemo, useState } from 'react'

import type {
  AgregarCuotaPayload,
  AliadoDetalle,
  AliadoResumen,
  CrearAcuerdoPayload,
  EstadoGeneralDeuda,
  RegistrarPagoPayload,
} from '../../types/appScript'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

interface AlliesPaymentsViewProps {
  allies: AliadoResumen[]
  error?: string | null
  isDetailLoading?: boolean
  isLoading?: boolean
  onAddCuota: (payload: AgregarCuotaPayload) => Promise<void>
  onCreateAgreement: (payload: CrearAcuerdoPayload) => Promise<void>
  onRegisterPayment: (payload: RegistrarPagoPayload) => Promise<void>
  onRefresh: () => Promise<void>
  onSelectAlly: (allyId: string | number) => Promise<void>
  selectedAllyDetail: AliadoDetalle | null
  selectedAllyId: string | number | null
}

const debtStatusLabels: Record<EstadoGeneralDeuda, string> = {
  pagado: 'Pagado',
  parcial: 'Parcial',
  pendiente: 'Pendiente',
  sin_deuda: 'Sin deuda',
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-PY', {
    currency: 'PYG',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(amount)
}

function getStatusStyles(status: string) {
  switch (status) {
    case 'pagado':
    case 'pagada':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
    case 'parcial':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400'
    case 'vencida':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
    case 'pendiente':
    default:
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
  }
}

export function AlliesPaymentsView({
  allies,
  error = null,
  isLoading = false,
  onRefresh,
  onSelectAlly,
  selectedAllyId,
}: AlliesPaymentsViewProps) {
  const [nameFilter, setNameFilter] = useState('')
  const [debtStatusFilter, setDebtStatusFilter] = useState<'all' | EstadoGeneralDeuda>('all')
  const [allyStatusFilter, setAllyStatusFilter] = useState<'all' | 'activo' | 'inactivo'>('all')

  const filteredAllies = useMemo(
    () =>
      allies.filter((ally) => {
        const matchesName = nameFilter
          ? ally.nombre_aliado.toLowerCase().includes(nameFilter.toLowerCase())
          : true
        const matchesDebtStatus =
          debtStatusFilter === 'all' ? true : ally.estado_general === debtStatusFilter
        const normalizedStatus = String(ally.estado || '').trim().toLowerCase()
        const matchesAllyStatus =
          allyStatusFilter === 'all'
            ? true
            : (normalizedStatus || 'inactivo') === allyStatusFilter
        return matchesName && matchesDebtStatus && matchesAllyStatus
      }),
    [allies, allyStatusFilter, debtStatusFilter, nameFilter],
  )

  const visibleDebt = useMemo(
    () => filteredAllies.reduce((total, ally) => total + ally.deuda_total, 0),
    [filteredAllies],
  )

  const visibleBalance = useMemo(
    () => filteredAllies.reduce((total, ally) => total + ally.saldo_pendiente, 0),
    [filteredAllies],
  )

  return (
    <section className="animate-fade-up animate-delay-2 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">Aliados</p>
          <h2 className="mt-0.5 text-xl font-black tracking-tight text-slate-950 dark:text-white">
            Seguimiento general de deuda y pagos
          </h2>
          <p className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
            Revisá el estado de cada aliado y entrá al detalle para ver cuotas y pagos.
          </p>
        </div>
        <Button className="interactive-lift shrink-0" onClick={() => void onRefresh()} variant="ghost">
          Actualizar
        </Button>
      </div>

      {/* Filtros en línea */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
        <div className="flex-1 min-w-[180px]">
          <Input
            id="allyNameFilter"
            label="Aliado"
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Buscar por nombre"
            value={nameFilter}
          />
        </div>
        <div className="min-w-[160px]">
          <Select
            id="debtStatusFilter"
            label="Estado de deuda"
            onChange={(e) => setDebtStatusFilter(e.target.value as 'all' | EstadoGeneralDeuda)}
            value={debtStatusFilter}
          >
            <option value="all">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="parcial">Parcial</option>
            <option value="pagado">Pagado</option>
            <option value="sin_deuda">Sin deuda</option>
          </Select>
        </div>
        <div className="min-w-[160px]">
          <Select
            id="allyStatusFilter"
            label="Estado del aliado"
            onChange={(e) => setAllyStatusFilter(e.target.value as 'all' | 'activo' | 'inactivo')}
            value={allyStatusFilter}
          >
            <option value="all">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </Select>
        </div>
        <div className="ml-auto flex flex-col items-end gap-0.5 text-xs font-black text-slate-700 dark:text-slate-300">
          <span>Deuda visible: {formatCurrency(visibleDebt)}</span>
          <span className="text-slate-500 dark:text-slate-400">Saldo visible: {formatCurrency(visibleBalance)}</span>
        </div>
      </div>

      {error ? (
        <div className="animate-soft-pop rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="animate-soft-pop rounded-xl border border-dashed border-emerald-950/15 bg-emerald-50/45 px-6 py-14 text-center text-sm font-medium text-slate-500 dark:border-emerald-800/30 dark:bg-emerald-900/10 dark:text-slate-400">
          Cargando aliados y resumen de pagos...
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm dark:divide-slate-700">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">ID</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">Aliado</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">Estado aliado</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">Estado deuda</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">Brand</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">Bolsa</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">RUC</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">Último período</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">Deuda total</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">Pagado</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">Saldo</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700 dark:divide-slate-700 dark:bg-slate-900 dark:text-slate-300">
                {filteredAllies.map((ally) => {
                  const isSelected = selectedAllyId === ally.aliado_id
                  return (
                    <tr
                      key={ally.aliado_id}
                      className={isSelected ? 'bg-emerald-50/60 dark:bg-emerald-900/20' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/50'}
                    >
                      <td className="px-3 py-3 font-bold text-slate-950 dark:text-white">{ally.aliado_id}</td>
                      <td className="px-3 py-3">
                        <p className="font-black text-slate-950 dark:text-white">{ally.nombre_aliado}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          {ally.estado || 'Sin estado'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusStyles(ally.estado_general)}`}>
                          {debtStatusLabels[ally.estado_general]}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-500 dark:text-slate-400">{ally.brand ?? '—'}</td>
                      <td className="px-3 py-3 text-slate-500 dark:text-slate-400">{ally.bolsa ?? '—'}</td>
                      <td className="px-3 py-3 text-slate-500 dark:text-slate-400">{ally.ruc ?? '—'}</td>
                      <td className="px-3 py-3 text-slate-500 dark:text-slate-400">{ally.ultimo_periodo ?? '—'}</td>
                      <td className="px-3 py-3">{formatCurrency(ally.deuda_total)}</td>
                      <td className="px-3 py-3">{formatCurrency(ally.monto_total_pagado)}</td>
                      <td className="px-3 py-3 font-bold text-slate-950 dark:text-white">
                        {formatCurrency(ally.saldo_pendiente)}
                      </td>
                      <td className="px-3 py-3">
                        <Button
                          className="interactive-lift"
                          onClick={() => void onSelectAlly(ally.aliado_id)}
                          variant={isSelected ? 'secondary' : 'ghost'}
                        >
                          {isSelected ? 'Cargado' : 'Ver detalle'}
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
