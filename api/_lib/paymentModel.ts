import { Schema, model, models } from 'mongoose'

export const paymentStatuses = ['Pendiente', 'Verificado', 'Rechazado'] as const

export type PaymentStatus = (typeof paymentStatuses)[number]

export interface PaymentDocument {
  aliado_id: string
  comercio: string
  comentarios: string[]
  estado: PaymentStatus
  fecha_subida: Date
  monto: number
  nro_factura: string
  url_imagen: string
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    aliado_id: {
      required: true,
      trim: true,
      type: String,
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
      enum: paymentStatuses,
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

paymentSchema.index({ aliado_id: 1, fecha_subida: -1 })
paymentSchema.index({ comercio: 1, estado: 1 })
paymentSchema.index({ nro_factura: 1, aliado_id: 1 }, { unique: true })

export const PaymentModel =
  models.Payment ?? model<PaymentDocument>('Payment', paymentSchema)
