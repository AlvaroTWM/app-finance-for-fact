import { Router } from 'express'

import {
  getInvoices,
  postInvoice,
  rejectInvoice,
  verifyInvoice,
} from '../controllers/invoices.controller.js'
import { uploadInvoiceImage } from '../middlewares/uploadInvoiceImage.js'

export const invoicesRouter = Router()

invoicesRouter.get('/invoices', getInvoices)
invoicesRouter.post('/invoices', uploadInvoiceImage.single('imagen'), postInvoice)
invoicesRouter.patch('/invoices/:invoiceId/verify', verifyInvoice)
invoicesRouter.patch('/invoices/:invoiceId/reject', rejectInvoice)
