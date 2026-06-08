import axios from 'axios'
import { readSheet } from 'read-excel-file/browser'

import type { PendingPaymentImportResult, PendingPaymentImportRow } from '../types/payment'

const paymentsApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})

const columnAliases = {
  aliado: ['aliado', 'nom_aliado', 'nombre_aliado'],
  mes: ['mes', 'month'],
  monto: ['monto_pagar', 'monto_total', 'monto', 'total'],
}

function normalizeHeader(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function getColumnIndex(headers: unknown[], aliases: string[]) {
  return headers.findIndex((header) => aliases.includes(normalizeHeader(String(header ?? ''))))
}

function formatMonth(value: unknown) {
  if (value instanceof Date) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}`
  }

  return String(value ?? '').trim()
}

function parseAmount(value: unknown) {
  if (typeof value === 'number') {
    return value
  }

  return Number(String(value ?? '').replace(/\./g, '').replace(',', '.'))
}

function parseTableRows(rows: unknown[][]): PendingPaymentImportRow[] {
  const [headers, ...dataRows] = rows

  if (!headers?.length) {
    throw new Error('El archivo no contiene encabezados para importar.')
  }

  const aliadoIndex = getColumnIndex(headers, columnAliases.aliado)
  const mesIndex = getColumnIndex(headers, columnAliases.mes)
  const montoIndex = getColumnIndex(headers, columnAliases.monto)

  if (aliadoIndex < 0 || mesIndex < 0 || montoIndex < 0) {
    throw new Error(
      'No encontramos las columnas requeridas. Usa MES, ALIADO y MONTO_PAGAR o sus equivalentes.',
    )
  }

  const parsedRows = dataRows
    .map((row) => {
      const aliado = String(row[aliadoIndex] ?? '').trim()
      const mes = formatMonth(row[mesIndex])
      const monto = parseAmount(row[montoIndex])

      return { aliado, mes, monto }
    })
    .filter((row) => row.aliado && row.mes && Number.isFinite(row.monto) && row.monto > 0)

  if (!parsedRows.length) {
    throw new Error(
      'No encontramos filas validas. Usa columnas MES, ALIADO y MONTO_PAGAR o sus equivalentes.',
    )
  }

  return parsedRows
}

function parseCsv(text: string) {
  return text
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.split(',').map((cell) => cell.trim()))
}

async function parsePendingPaymentsFile(file: File): Promise<PendingPaymentImportRow[]> {
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (extension === 'csv') {
    return parseTableRows(parseCsv(await file.text()))
  }

  if (extension !== 'xlsx') {
    throw new Error('Por seguridad, por ahora aceptamos archivos .xlsx o .csv.')
  }

  const rows = await readSheet(file)

  return parseTableRows(rows)
}

export async function importPendingPayments(file: File): Promise<PendingPaymentImportResult> {
  const rows = await parsePendingPaymentsFile(file)
  const response = await paymentsApi.post<PendingPaymentImportResult>('/payments/import', {
    filename: file.name,
    rows,
    size: file.size,
    type: file.type,
  })

  return response.data
}
