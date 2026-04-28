import 'dotenv/config'

export const env = {
  clientOrigins: (process.env.CLIENT_ORIGINS ?? 'http://127.0.0.1:5173,http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  host: process.env.HOST ?? '127.0.0.1',
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/loyalty_facturas',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  useMockDb: process.env.USE_MOCK_DB !== 'false',
}
