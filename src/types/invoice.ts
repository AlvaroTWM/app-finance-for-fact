export const invoiceStatuses = ['Pendiente', 'Verificado', 'Rechazado'] as const

export type InvoiceStatus = (typeof invoiceStatuses)[number]

export type UserRole = 'Alianzas'

export interface Invoice {
  id: string
  nro_factura: string
  comercio: string
  monto: number
  fecha_subida: string
  url_imagen: string
  estado: InvoiceStatus
  aliado_id: string
  comentarios: string[]
}

export interface UploadInvoicePayload {
  nro_factura: string
  comercio: string
  aliado_id: string
  imagen: File
  monto?: number
}

export interface VerifyInvoicePayload {
  comentarios?: string[]
}

export interface RejectInvoicePayload {
  comentarios?: string[]
}
