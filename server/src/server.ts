import { app } from './app.js'
import { connectDatabase } from './config/database.js'
import { env } from './config/env.js'

async function bootstrap() {
  if (env.useMockDb) {
    console.log('Modo seguro temporal: MongoDB desactivado, datos en memoria.')
  } else {
    await connectDatabase()
  }

  app.listen(env.port, env.host, () => {
    console.log(`API escuchando en http://${env.host}:${env.port}`)
  })
}

bootstrap().catch((error) => {
  console.error('No fue posible iniciar la API:', error)
  process.exit(1)
})
