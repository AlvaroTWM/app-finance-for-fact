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

export async function getInvoices(): Promise<Invoice[]> {
  const response = await invoicesApi.get<Invoice[]>('/invoices')
  return response.data
}

export async function createInvoice(payload: UploadInvoicePayload): Promise<Invoice> {
  const response = await invoicesApi.post<Invoice>('/invoices', {
    aliado_id: payload.aliado_id,
    comercio: payload.comercio,
    imagen_nombre: payload.imagen.name,
    imagen_tipo: payload.imagen.type,
    monto: payload.monto,
    nro_factura: payload.nro_factura,
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
