import axios from 'axios'

import type {
  Invoice,
  RejectInvoicePayload,
  UploadInvoicePayload,
  VerifyInvoicePayload,
} from '../types/invoice'

const invoicesApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
})

export async function getInvoices(): Promise<Invoice[]> {
  const response = await invoicesApi.get<Invoice[]>('/invoices')
  return response.data
}

export async function createInvoice(payload: UploadInvoicePayload): Promise<Invoice> {
  const formData = new FormData()

  formData.append('nro_factura', payload.nro_factura)
  formData.append('comercio', payload.comercio)
  formData.append('aliado_id', payload.aliado_id)
  formData.append('imagen', payload.imagen)

  if (typeof payload.monto === 'number') {
    formData.append('monto', String(payload.monto))
  }

  const response = await invoicesApi.post<Invoice>('/invoices', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export async function verifyInvoiceById(
  invoiceId: string,
  payload: VerifyInvoicePayload = {},
): Promise<Invoice> {
  const response = await invoicesApi.patch<Invoice>(`/invoices/${invoiceId}/verify`, payload)
  return response.data
}

export async function rejectInvoiceById(
  invoiceId: string,
  payload: RejectInvoicePayload = {},
): Promise<Invoice> {
  const response = await invoicesApi.patch<Invoice>(`/invoices/${invoiceId}/reject`, payload)
  return response.data
}
