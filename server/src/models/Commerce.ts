import { Schema, model } from 'mongoose'

export interface CommerceDocument {
  active: boolean
  name: string
}

const commerceSchema = new Schema<CommerceDocument>(
  {
    active: {
      default: true,
      type: Boolean,
    },
    name: {
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
)

export const CommerceModel = model<CommerceDocument>('Commerce', commerceSchema)
