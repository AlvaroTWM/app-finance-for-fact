import { useEffect, useMemo, useState } from 'react'

import {
  createInvoice as createInvoiceRequest,
  getInvoices,
  rejectInvoiceById,
  verifyInvoiceById,
} from '../services/invoices'
import type {
  Invoice,
  InvoiceFilter,
  RejectInvoicePayload,
  UploadInvoicePayload,
  UserRole,
  VerifyInvoicePayload,
} from '../types/invoice'

interface UseInvoicesOptions {
  role: UserRole
  userId: string
}

const defaultFilterByRole: Record<UserRole, InvoiceFilter> = {
  Aliado: 'mine',
  Alianzas: 'pending',
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message === 'Network Error') {
      return 'No pudimos cargar tus facturas. Intenta nuevamente.'
    }

    return error.message
  }

  return 'Ocurrio un error inesperado al procesar las facturas.'
}

export function useInvoices({ role, userId }: UseInvoicesOptions) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filter, setFilter] = useState<InvoiceFilter>(defaultFilterByRole[role])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getInvoices()
      setInvoices(data)
    } catch (fetchError) {
      setError(getErrorMessage(fetchError))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const loadInvoices = async () => {
      try {
        const data = await getInvoices()

        if (!isMounted) {
          return
        }

        setInvoices(data)
        setError(null)
      } catch (fetchError) {
        if (isMounted) {
          setError(getErrorMessage(fetchError))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadInvoices()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredInvoices = useMemo(() => {
    switch (filter) {
      case 'pending':
        return invoices.filter((invoice) => invoice.estado === 'Pendiente')
      case 'mine':
        return invoices.filter((invoice) => invoice.aliado_id === userId)
      case 'all':
      default:
        return invoices
    }
  }, [filter, invoices, userId])

  const uploadInvoice = async (payload: UploadInvoicePayload) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const createdInvoice = await createInvoiceRequest(payload)
      setInvoices((currentInvoices) => [createdInvoice, ...currentInvoices])
      return createdInvoice
    } catch (submitError) {
      const message = getErrorMessage(submitError)
      setError(message)
      throw new Error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const verifyInvoice = async (invoiceId: string, payload?: VerifyInvoicePayload) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const verifiedInvoice = await verifyInvoiceById(invoiceId, payload)
      setInvoices((currentInvoices) =>
        currentInvoices.map((invoice) =>
          invoice.id === invoiceId ? verifiedInvoice : invoice,
        ),
      )

      return verifiedInvoice
    } catch (submitError) {
      const message = getErrorMessage(submitError)
      setError(message)
      throw new Error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const rejectInvoice = async (invoiceId: string, payload?: RejectInvoicePayload) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const rejectedInvoice = await rejectInvoiceById(invoiceId, payload)
      setInvoices((currentInvoices) =>
        currentInvoices.map((invoice) =>
          invoice.id === invoiceId ? rejectedInvoice : invoice,
        ),
      )

      return rejectedInvoice
    } catch (submitError) {
      const message = getErrorMessage(submitError)
      setError(message)
      throw new Error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    error,
    filter,
    filteredInvoices,
    invoices,
    isLoading,
    isSubmitting,
    rejectInvoice,
    setFilter,
    uploadInvoice,
    verifyInvoice,
    refetch: fetchInvoices,
  }
}
