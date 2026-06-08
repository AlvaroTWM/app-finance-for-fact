export interface PendingPaymentImportResult {
  filename: string
  message: string
  mode: 'memory-only'
  rowsReceived: number
  requiredColumns: string[]
}

export interface PendingPaymentImportRow {
  aliado: string
  mes: string
  monto: number
}
