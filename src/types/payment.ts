export interface PendingPaymentImportResult {
  filename: string
  message: string
  mode: 'memory-only'
  requiredColumns: string[]
}

export interface InstallmentPaymentItem {
  amount: number
  id: string
  label: string
  month: string
}
