import { Schema, model, type Types } from 'mongoose'

export const invoiceStatuses = ['Pendiente', 'Verificado', 'Rechazado'] as const

export type InvoiceStatus = (typeof invoiceStatuses)[number]

export interface InvoiceDocument {
  aliado: Types.ObjectId
  comercio: string
  comentarios: string[]
  estado: InvoiceStatus
  fecha_subida: Date
  monto: number
  nro_factura: string
  url_imagen: string
}

const invoiceSchema = new Schema<InvoiceDocument>(
  {
    aliado: {
      ref: 'User',
      required: true,
      type: Schema.Types.ObjectId,
    },
    comercio: {
      required: true,
      trim: true,
      type: String,
    },
    comentarios: {
      default: [],
      type: [String],
    },
    estado: {
      default: 'Pendiente',
      enum: invoiceStatuses,
      required: true,
      type: String,
    },
    fecha_subida: {
      default: Date.now,
      required: true,
      type: Date,
    },
    monto: {
      min: 0,
      required: true,
      type: Number,
    },
    nro_factura: {
      required: true,
      trim: true,
      type: String,
    },
    url_imagen: {
      required: true,
      trim: true,
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

invoiceSchema.index({ aliado: 1, fecha_subida: -1 })
invoiceSchema.index({ comercio: 1, estado: 1 })
invoiceSchema.index({ nro_factura: 1, aliado: 1 }, { unique: true })

export const InvoiceModel = model<InvoiceDocument>('Invoice', invoiceSchema)
