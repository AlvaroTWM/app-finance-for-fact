import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent, FormEvent } from 'react'

import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import type { Invoice, UploadInvoicePayload } from '../../types/invoice'

interface UploadFormProps {
  aliadoId: string
  isSubmitting?: boolean
  onUpload: (payload: UploadInvoicePayload) => Promise<Invoice>
}

const commerceSuggestions = [
  'BIGGIE Express',
  'Supermercado Stock',
  'Farmacenter',
  'Petropar',
  'Shopping del Sol',
]

const uploadSteps = [
  'Factura',
  'Comercio',
  'Monto',
  'Evidencia',
]

export function UploadForm({
  aliadoId,
  isSubmitting = false,
  onUpload,
}: UploadFormProps) {
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [commerce, setCommerce] = useState('')
  const [amount, setAmount] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile],
  )

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files?.[0] ?? null

    if (file?.type.startsWith('image/')) {
      setSelectedFile(file)
      setError(null)
      return
    }

    setError('Selecciona una imagen en formato PNG, JPG o WEBP.')
  }

  const resetForm = () => {
    setInvoiceNumber('')
    setCommerce('')
    setAmount('')
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (!invoiceNumber.trim()) {
      setError('Ingresa un numero de factura valido.')
      return
    }

    if (!commerce.trim()) {
      setError('Ingresa el nombre del comercio.')
      return
    }

    if (!amount || Number(amount) <= 0) {
      setError('Ingresa el monto total de la factura.')
      return
    }

    if (!selectedFile) {
      setError('Selecciona una imagen antes de continuar.')
      return
    }

    try {
      await onUpload({
        aliado_id: aliadoId,
        comercio: commerce.trim(),
        imagen: selectedFile,
        monto: Number(amount),
        nro_factura: invoiceNumber.trim(),
      })

      resetForm()
      setSuccessMessage('Factura enviada a validacion. El equipo de alianzas la revisara pronto.')
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : ''
      setError(
        message === 'No pudimos cargar tus facturas. Intenta nuevamente.'
          ? 'No pudimos enviar tu factura. Intenta nuevamente.'
          : message || 'No pudimos enviar tu factura. Intenta nuevamente.',
      )
    }
  }

  return (
    <section
      id="upload-invoice-form"
      className="animate-fade-up animate-delay-2 rounded-[2rem] border border-emerald-950/10 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.07)] backdrop-blur"
    >
      <div className="border-b border-emerald-950/10 pb-5">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">
          Carga de Factura
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-normal text-slate-950">
          Adjunta tu evidencia de compra
        </h2>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          Completa los pasos y adjunta una imagen legible para enviarla a validacion.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {uploadSteps.map((step, index) => (
          <div key={step} className="rounded-2xl bg-emerald-50/80 p-3 text-center">
            <span className="mx-auto grid size-7 place-items-center rounded-full bg-emerald-500 text-xs font-black text-emerald-950">
              {index + 1}
            </span>
            <p className="mt-2 text-[11px] font-black uppercase tracking-[0.08em] text-slate-600">
              {step}
            </p>
          </div>
        ))}
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div className="rounded-3xl border border-emerald-950/10 bg-white/70 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
            Paso 1
          </p>
          <Input
            className="mt-1"
            id="invoiceNumber"
            label="Numero de factura"
            onChange={(event) => setInvoiceNumber(event.target.value)}
            placeholder="Ej: FAC-000123"
            value={invoiceNumber}
          />
        </div>

        <div className="rounded-3xl border border-emerald-950/10 bg-white/70 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
            Paso 2
          </p>
          <Input
            className="mt-1"
            hint="Puedes escribir libremente o elegir una sugerencia."
            id="invoiceCommerce"
            label="Comercio"
            list="commerce-upload-options"
            onChange={(event) => setCommerce(event.target.value)}
            placeholder="Ej: Supermercado Stock"
            value={commerce}
          />
          <datalist id="commerce-upload-options">
            {commerceSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </div>

        <div className="rounded-3xl border border-emerald-950/10 bg-white/70 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
            Paso 3
          </p>
          <Input
            className="mt-1"
            hint="Lo usamos para priorizar revision y reportes."
            id="invoiceAmount"
            inputMode="decimal"
            label="Monto total"
            min="0"
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Ej: 150000"
            step="0.01"
            type="number"
            value={amount}
          />
        </div>

        <div className="rounded-3xl border border-emerald-950/10 bg-white/70 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
            Paso 4
          </p>
          <p className="mt-2 text-sm font-bold text-slate-700">Imagen de la factura</p>
          <label
            htmlFor="invoiceFile"
            onDragLeave={() => setIsDragging(false)}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDrop={handleDrop}
            className={`mt-3 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-4 py-6 text-center transition ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-emerald-950/20 bg-emerald-50/40 hover:border-emerald-400 hover:bg-emerald-50/80'
            }`}
          >
            {previewUrl ? (
              <img
                alt="Vista previa de la factura"
                className="max-h-44 rounded-2xl object-contain shadow-[0_18px_44px_rgba(15,23,42,0.12)]"
                src={previewUrl}
              />
            ) : (
              <>
                <span className="grid size-12 place-items-center rounded-full bg-white text-xl font-black text-emerald-800 shadow-sm">
                  +
                </span>
                <span className="mt-3 text-sm font-black text-slate-950">
                  Arrastra la imagen o haz click para seleccionar
                </span>
                <span className="mt-1 text-xs font-medium text-slate-500">
                  PNG, JPG o WEBP. Procura que numero y monto sean legibles.
                </span>
              </>
            )}
          </label>
          <input
            accept="image/*"
            className="sr-only"
            id="invoiceFile"
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />
          {selectedFile ? (
            <p className="mt-3 truncate text-xs font-semibold text-emerald-800">
              Archivo seleccionado: {selectedFile.name}
            </p>
          ) : null}
        </div>

        {error ? (
          <div className="animate-soft-pop rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="animate-soft-pop rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <Button className="interactive-lift w-full" isLoading={isSubmitting} type="submit">
          Enviar a validacion
        </Button>
      </form>
    </section>
  )
}
