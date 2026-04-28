import { Router } from 'express'

import { importPendingPayments } from '../controllers/payments.controller.js'
import { uploadPendingPaymentsFile } from '../middlewares/uploadPendingPaymentsFile.js'

export const paymentsRouter = Router()

paymentsRouter.post('/payments/import', uploadPendingPaymentsFile.single('archivo'), importPendingPayments)
