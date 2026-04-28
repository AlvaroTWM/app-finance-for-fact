import type { Request, Response } from 'express'

const requiredColumns = ['mes', 'nom_aliado', 'monto_total']

export function importPendingPayments(request: Request, response: Response) {
  if (!request.file) {
    response.status(400).json({
      message: 'Adjunta un archivo Excel o CSV con pagos pendientes.',
    })
    return
  }

  response.status(202).json({
    filename: request.file.originalname,
    message:
      'Archivo recibido de forma segura. En esta fase se valida en memoria y no se almacena.',
    mode: 'memory-only',
    requiredColumns,
  })
}
