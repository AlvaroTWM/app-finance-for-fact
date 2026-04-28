import mongoose from 'mongoose'

import { env } from './env.js'

export async function connectDatabase() {
  mongoose.connection.on('connected', () => {
    console.log('MongoDB conectado')
  })

  mongoose.connection.on('error', (error) => {
    console.error('Error de MongoDB:', error)
  })

  await mongoose.connect(env.mongoUri)
}
