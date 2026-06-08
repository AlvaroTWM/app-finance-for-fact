import axios from 'axios'

import type {
  Invoice,
  RejectInvoicePayload,
  UploadInvoicePayload,
  VerifyInvoicePayload,
} from '../types/invoice'

const invoicesApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})

function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data

    if (
      typeof responseMessage === 'object' &&
      responseMessage !== null &&
      'message' in responseMessage &&
      typeof responseMessage.message === 'string'
    ) {
      return responseMessage.message
    }

    if (error.response?.status) {
      return 'No pudimos cargar tus pagos. Intenta nuevamente.'
    }
  }

  if (error instanceof Error && error.message === 'Network Error') {
    return 'No pudimos conectar con el servidor. Verifica que el backend este activo.'
  }

  return error instanceof Error ? error.message : 'Ocurrio un error inesperado.'
}

export async function getInvoices(): Promise<Invoice[]> {
  try {
    const response = await invoicesApi.get<Invoice[]>('/invoices')

    if (!Array.isArray(response.data)) {
      throw new Error('La API devolvio un formato inesperado para los pagos.')
    }

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export async function createInvoice(payload: UploadInvoicePayload): Promise<Invoice> {
  const formData = new FormData()
  formData.append('aliado_id', payload.aliado_id)
  formData.append('comercio', payload.comercio)
  formData.append('imagen', payload.imagen)
  formData.append('monto', String(payload.monto ?? 0))
  formData.append('nro_factura', payload.nro_factura)

  try {
    const response = await invoicesApi.post<Invoice>('/invoices', formData)

    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export async function verifyInvoiceById(
  invoiceId: string,
  payload: VerifyInvoicePayload = {},
): Promise<Invoice> {
  try {
    const response = await invoicesApi.patch<Invoice>(`/invoices/${invoiceId}/verify`, payload)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}

export async function rejectInvoiceById(
  invoiceId: string,
  payload: RejectInvoicePayload = {},
): Promise<Invoice> {
  try {
    const response = await invoicesApi.patch<Invoice>(`/invoices/${invoiceId}/reject`, payload)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error))
  }
}
