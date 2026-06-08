import { useState } from 'react'

import type { CrearAcuerdoPayload, CuotaInput } from '../../types/appScript'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface CreateAgreementFormProps {
  aliadoId: string
  aliadoNombre: string
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: (payload: CrearAcuerdoPayload) => Promise<void>
  successMessage: string | null
}

const today = new Date().toISOString().slice(0, 10)

type CuotaRow = CuotaInput & { _key: number }

function emptyCuota(numero: number): CuotaRow {
  return { _key: Date.now() + numero, fecha_pago: today, monto_cuota: 0, numero_cuota: numero }
}

export function CreateAgreementForm({
  aliadoId,
  aliadoNombre,
  isSubmitting,
  onCancel,
  onSubmit,
  successMessage,
}: CreateAgreementFormProps) {
  const [brand, setBrand] = useState('')
  const [bolsa, setBolsa] = useState('')
  const [ruc, setRuc] = useState('')
  const [periodo, setPeriodo] = useState('')
  const [numFactura, setNumFactura] = useState('')
  const [servicio, setServicio] = useState('')
  const [fechaCompromiso, setFechaCompromiso] = useState(today)
  const [observaciones, setObservaciones] = useState('')
  const [cuotas, setCuotas] = useState<CuotaRow[]>([emptyCuota(1)])
  const [validationError, setValidationError] = useState<string | null>(null)

  const montoTotal = cuotas.reduce((s, c) => s + (Number(c.monto_cuota) || 0), 0)

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('es-PY', {
      currency: 'PYG',
      maximumFractionDigits: 0,
      style: 'currency',
    }).format(n)

  const addCuota = () => {
    setCuotas((prev) => [...prev, emptyCuota(prev.length + 1)])
  }

  const removeCuota = (key: number) => {
    setCuotas((prev) => {
      const next = prev.filter((c) => c._key !== key)
      return next.map((c, i) => ({ ...c, numero_cuota: i + 1 }))
    })
  }

  const updateCuota = (key: number, field: 'monto_cuota' | 'fecha_pago', value: string) => {
    setCuotas((prev) =>
      prev.map((c) =>
        c._key === key
          ? { ...c, [field]: field === 'monto_cuota' ? Number(value) || 0 : value }
          : c,
      ),
    )
  }

  const handleSubmit = async () => {
    setValidationError(null)

    if (!fechaCompromiso) {
      setValidationError('La fecha de compromiso es obligatoria.')
      return
    }
    if (cuotas.length === 0) {
      setValidationError('Agregá al menos una cuota.')
      return
    }
    const invalid = cuotas.find((c) => !c.monto_cuota || !c.fecha_pago)
    if (invalid) {
      setValidationError('Todas las cuotas deben tener monto y fecha de pago.')
      return
    }

    await onSubmit({
      aliadoId,
      bolsa: bolsa || undefined,
      brand: brand || undefined,
      cuotas: cuotas.map(({ _key: _k, ...c }) => c),
      fechaCompromiso,
      montoTotal,
      numFactura: numFactura || undefined,
      observaciones: observaciones || undefined,
      periodo: periodo || undefined,
      ruc: ruc || undefined,
      servicio: servicio || undefined,
    })
  }

  return (
    <div className="space-y-6">
      {/* Identificación de la factura */}
      <div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
          Identificación
        </p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Input
            id="agBrand"
            label="Brand"
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Ej: Ueno"
            value={brand}
          />
          <Input
            id="agBolsa"
            label="Bolsa"
            onChange={(e) => setBolsa(e.target.value)}
            placeholder="Ej: Bolsa Digital Q2"
            value={bolsa}
          />
          <Input
            id="agRuc"
            label="RUC"
            onChange={(e) => setRuc(e.target.value)}
            placeholder="Ej: 80012345-1"
            value={ruc}
          />
          <Input
            id="agNumFactura"
            label="Num. Factura"
            onChange={(e) => setNumFactura(e.target.value)}
            placeholder="Ej: FAC-0042"
            value={numFactura}
          />
          <Input
            id="agPeriodo"
            label="Periodo"
            onChange={(e) => setPeriodo(e.target.value)}
            placeholder="Ej: Mayo 2026"
            value={periodo}
          />
          <Input
            id="agServicio"
            label="Servicio"
            onChange={(e) => setServicio(e.target.value)}
            placeholder="Ej: Publicidad digital"
            value={servicio}
          />
          <Input
            id="agFechaCompromiso"
            label="Fecha de compromiso *"
            onChange={(e) => setFechaCompromiso(e.target.value)}
            type="date"
            value={fechaCompromiso}
          />
        </div>
      </div>

      {/* Cuotas */}
      <div>
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Cuotas
            </p>
            {montoTotal > 0 && (
              <p className="mt-0.5 text-xs text-slate-400">
                Monto Neto:{' '}
                <span className="font-black text-emerald-300">{formatCurrency(montoTotal)}</span>
              </p>
            )}
          </div>
          <Button
            className="interactive-lift shrink-0"
            onClick={addCuota}
            type="button"
            variant="ghost"
          >
            + Agregar cuota
          </Button>
        </div>

        <div className="space-y-2">
          {cuotas.map((cuota, index) => (
            <div
              key={cuota._key}
              className="grid grid-cols-[32px_1fr_1fr_32px] items-end gap-3 rounded-xl bg-white/5 px-3 py-3"
            >
              <span className="mb-2 text-center text-xs font-black text-slate-500">
                {index + 1}
              </span>
              <Input
                id={`cuota-monto-${cuota._key}`}
                inputMode="decimal"
                label="Monto"
                min="0"
                onChange={(e) => updateCuota(cuota._key, 'monto_cuota', e.target.value)}
                placeholder="Ej: 500000"
                step="1"
                type="number"
                value={cuota.monto_cuota === 0 ? '' : String(cuota.monto_cuota)}
              />
              <Input
                id={`cuota-fecha-${cuota._key}`}
                label="Fecha de pago"
                onChange={(e) => updateCuota(cuota._key, 'fecha_pago', e.target.value)}
                type="date"
                value={cuota.fecha_pago}
              />
              <button
                aria-label="Quitar cuota"
                className="mb-2 grid size-8 place-items-center rounded-full text-slate-500 hover:bg-white/10 hover:text-rose-400 disabled:opacity-30"
                disabled={cuotas.length === 1}
                onClick={() => removeCuota(cuota._key)}
                type="button"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Observaciones */}
      <Input
        id="agObs"
        label="Observaciones"
        onChange={(e) => setObservaciones(e.target.value)}
        placeholder="Opcional"
        value={observaciones}
      />

      {validationError ? (
        <p className="rounded-2xl border border-rose-200/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300">
          {validationError}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {successMessage ? (
          <p className="text-sm font-semibold text-emerald-300">{successMessage}</p>
        ) : (
          <span className="text-sm text-slate-400">
            Confirmá para guardar el acuerdo con {cuotas.length}{' '}
            {cuotas.length === 1 ? 'cuota' : 'cuotas'} — Total{' '}
            <span className="font-black text-white">{formatCurrency(montoTotal)}</span>
          </span>
        )}

        <div className="flex gap-3">
          <Button
            className="interactive-lift"
            onClick={onCancel}
            type="button"
            variant="ghost"
          >
            Cancelar
          </Button>
          <Button
            className="interactive-lift min-w-[200px]"
            isLoading={isSubmitting}
            onClick={() => void handleSubmit()}
            type="button"
            variant="primary"
          >
            Confirmar — {aliadoNombre}
          </Button>
        </div>
      </div>
    </div>
  )
}
