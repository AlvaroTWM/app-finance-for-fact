import mongoose from 'mongoose'

let connectionPromise: Promise<typeof mongoose> | null = null

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('MONGODB_URI no esta configurada.')
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose
  }

  connectionPromise ??= mongoose.connect(mongoUri)

  return connectionPromise
}
