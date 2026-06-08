import { Router } from 'express'

import { appsScriptRouter } from './appsScript.routes.js'
import { healthRouter } from './health.routes.js'
import { invoicesRouter } from './invoices.routes.js'
import { paymentsRouter } from './payments.routes.js'

export const apiRouter = Router()

apiRouter.use(appsScriptRouter)
apiRouter.use(healthRouter)
apiRouter.use(invoicesRouter)
apiRouter.use(paymentsRouter)
