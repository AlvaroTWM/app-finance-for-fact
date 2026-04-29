import { handleOptions, setCorsHeaders } from '../_lib/cors'
import type { ApiRequest, ApiResponse } from '../_lib/http'
import { isRecord } from '../_lib/http'

const requiredColumns = ['mes', 'nom_aliado', 'monto_total']

export default function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method === 'OPTIONS') {
    handleOptions(request, response)
    return
  }

  setCorsHeaders(request, response)

  if (request.method !== 'POST') {
    response.status(405).json({ message: 'Metodo no permitido.' })
    return
  }

  const body = isRecord(request.body) ? request.body : {}
  const filename = typeof body.filename === 'string' ? body.filename : 'archivo-pagos-pendientes'

  response.status(202).json({
    filename,
    message:
      'Archivo recibido de forma segura. En esta demo se valida metadata y no se almacena el archivo original.',
    mode: 'memory-only',
    requiredColumns,
  })
}
