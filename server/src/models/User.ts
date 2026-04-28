import { Schema, model } from 'mongoose'

export type UserRole = 'Aliado' | 'Alianzas'

export interface UserDocument {
  email: string
  name: string
  passwordHash: string
  role: UserRole
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    name: {
      required: true,
      trim: true,
      type: String,
    },
    passwordHash: {
      required: true,
      type: String,
    },
    role: {
      enum: ['Aliado', 'Alianzas'],
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

export const UserModel = model<UserDocument>('User', userSchema)
