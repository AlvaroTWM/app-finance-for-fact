import axios from 'axios'

import type { PendingPaymentImportResult } from '../types/payment'

const paymentsApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3000/api',
})

export async function importPendingPayments(file: File): Promise<PendingPaymentImportResult> {
  const formData = new FormData()
  formData.append('archivo', file)

  const response = await paymentsApi.post<PendingPaymentImportResult>(
    '/payments/import',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  return response.data
}
