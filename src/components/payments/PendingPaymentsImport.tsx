import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { ArrowUpTrayIcon, TableCellsIcon } from '@heroicons/react/24/outline'

import { Button } from '../ui/Button'
import { importPendingPayments } from '../../services/payments'
import type { PendingPaymentImportResult } from '../../types/payment'

const acceptedExtensions = '.xlsx,.xls,.csv'

function getFriendlyImportError(error: unknown) {
  if (error instanceof Error && error.message !== 'Network Error') {
    return error.message
  }

  return 'No pudimos subir el archivo. Verifica que el backend temporal este activo.'
}

export function PendingPaymentsImport() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<PendingPaymentImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] ?? null)
    setResult(null)
    setError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setResult(null)

    if (!selectedFile) {
      setError('Selecciona un archivo Excel o CSV para continuar.')
      return
    }

    try {
      setIsSubmitting(true)
      const importResult = await importPendingPayments(selectedFile)
      setResult(importResult)
      setSelectedFile(null)

      if (inputRef.current) {
        inputRef.current.value = ''
      }
    } catch (submitError) {
      setError(getFriendlyImportError(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="surface-shine animate-fade-up animate-delay-2 rounded-[2rem] border border-emerald-950/10 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.07)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-900">
            <TableCellsIcon aria-hidden="true" className="size-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">
              Carga masiva
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Importa pagos pendientes
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
              Sube un Excel con las columnas <strong>mes</strong>, <strong>nom_aliado</strong> y{' '}
              <strong>monto_total</strong>. Por ahora el archivo se valida en memoria y no se guarda.
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-3 sm:min-w-[360px]" onSubmit={handleSubmit}>
          <label className="interactive-lift flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-emerald-950/20 bg-emerald-50/50 px-4 py-3 hover:border-emerald-400 hover:bg-emerald-50">
            <ArrowUpTrayIcon aria-hidden="true" className="size-5 text-emerald-800" />
            <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-700">
              {selectedFile ? selectedFile.name : 'Seleccionar Excel o CSV'}
            </span>
            <input
              ref={inputRef}
              accept={acceptedExtensions}
              className="sr-only"
              onChange={handleFileChange}
              type="file"
            />
          </label>

          <Button className="interactive-lift" isLoading={isSubmitting} type="submit">
            Subir pagos pendientes
          </Button>
        </form>
      </div>

      {error ? (
        <div className="animate-soft-pop mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="animate-soft-pop mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {result.message} Archivo recibido: <strong>{result.filename}</strong>.
        </div>
      ) : null}
    </section>
  )
}
