import cors from 'cors'
import express from 'express'

import { env } from './config/env.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { notFound } from './middlewares/notFound.js'
import { apiRouter } from './routes/index.js'
import { getUploadsRootDir } from './services/localFileStorage.js'

export const app = express()

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.clientOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Origen no permitido por CORS.'))
    },
  }),
)
app.use(express.json())
app.use('/uploads', express.static(getUploadsRootDir()))

app.use('/api', apiRouter)

app.use(notFound)
app.use(errorHandler)
