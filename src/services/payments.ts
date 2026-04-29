import axios from 'axios'

import type { PendingPaymentImportResult } from '../types/payment'

const paymentsApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})

export async function importPendingPayments(file: File): Promise<PendingPaymentImportResult> {
  const response = await paymentsApi.post<PendingPaymentImportResult>('/payments/import', {
    filename: file.name,
    size: file.size,
    type: file.type,
  })

  return response.data
}
