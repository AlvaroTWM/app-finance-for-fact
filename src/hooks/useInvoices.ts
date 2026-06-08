import { useEffect, useState } from 'react'

import {
  getInvoices,
  rejectInvoiceById,
  verifyInvoiceById,
} from '../services/invoices'
import type { Invoice, RejectInvoicePayload, VerifyInvoicePayload } from '../types/invoice'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message === 'Network Error') {
      return 'No pudimos cargar tus pagos. Intenta nuevamente.'
    }

    return error.message
  }

  return 'Ocurrio un error inesperado al procesar los pagos.'
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
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

  const verifyInvoice = async (invoiceId: string, payload?: VerifyInvoicePayload) => {
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
    }
  }

  const rejectInvoice = async (invoiceId: string, payload?: RejectInvoicePayload) => {
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
    }
  }

  return {
    error,
    invoices,
    isLoading,
    rejectInvoice,
    verifyInvoice,
    refetch: fetchInvoices,
  }
}
