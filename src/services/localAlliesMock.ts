import type {
  AgregarCuotaPayload,
  AliadoDetalle,
  AliadoResumen,
  CrearAcuerdoPayload,
  CuotaRecord,
  DeudaRecord,
  EstadoGeneralDeuda,
  PagoRecord,
  RegistrarPagoPayload,
} from '../types/appScript'
import type { AuthUser } from '../types/auth'

const localSessionUser: AuthUser = {
  email: 'alianzas.dev@itti.digital',
  id: 'local-dev-001',
  name: 'Maria Paz',
  role: 'Alianzas',
}

const mockAlliesBase = [
  { aliado_id: 'A-001', estado: 'activo',   nombre_aliado: 'Maxifarma Encarnacion' },
  { aliado_id: 'A-002', estado: 'activo',   nombre_aliado: 'Bacon' },
  { aliado_id: 'A-003', estado: 'activo',   nombre_aliado: 'Starbucks' },
  { aliado_id: 'A-004', estado: 'activo',   nombre_aliado: 'Burguer King' },
  { aliado_id: 'A-005', estado: 'activo',   nombre_aliado: 'Pizza Hut' },
  { aliado_id: 'A-006', estado: 'activo',   nombre_aliado: 'Don Vito' },
  { aliado_id: 'A-007', estado: 'activo',   nombre_aliado: 'Lomy' },
]

let mockDeudas: DeudaRecord[] = [
  // A-001 — FARMACIAS / MAXIFARMA ENCARNACION — cuotas parcial
  {
    aliado_id: 'A-001', bolsa: 'FARMACIAS', brand: 'MAXIFARMA ENCARNACION', cantidad_cuotas: 3, deuda_id: 'D-1001',
    estado_deuda: 'parcial', fecha_compromiso: '2026-04-12', monto_total_deuda: 4500000,
    monto_total_pagado: 1500000, num_factura: 'FAC-0042', observaciones: 'Plan especial de abril.',
    periodo: 'Abril 2026', ruc: '80012345-1', saldo_pendiente: 3000000,
    servicio: 'Publicidad digital', tipo_pago: 'cuotas',
  },
  // A-001 — segunda deuda ya pagada
  {
    aliado_id: 'A-001', bolsa: 'FARMACIAS', brand: 'MAXIFARMA ENCARNACION', cantidad_cuotas: 1, deuda_id: 'D-1007',
    estado_deuda: 'pagado', fecha_compromiso: '2026-03-01', fecha_pago: '2026-03-31',
    monto_total_deuda: 800000, monto_total_pagado: 800000, num_factura: 'FAC-0031',
    observaciones: 'Servicio de marzo cancelado.', periodo: 'Marzo 2026',
    ruc: '80012345-1', saldo_pendiente: 0, servicio: 'Publicidad digital', tipo_pago: 'unico',
  },
  // A-002 — GASTRONOMIA / BACON — 2 cuotas pendientes
  {
    aliado_id: 'A-002', bolsa: 'GASTRONOMIA', brand: 'BACON', cantidad_cuotas: 2, deuda_id: 'D-1002',
    estado_deuda: 'pendiente', fecha_compromiso: '2026-05-05', monto_total_deuda: 1800000,
    monto_total_pagado: 0, num_factura: 'FAC-0058', observaciones: 'Pendiente de primer pago.',
    periodo: 'Mayo 2026', ruc: '80023456-2', saldo_pendiente: 1800000,
    servicio: 'Publicidad digital', tipo_pago: 'cuotas',
  },
  // A-003 — LUNES DE STARBUCKS / STARBUCKS — pago único pendiente
  {
    aliado_id: 'A-003', bolsa: 'LUNES DE STARBUCKS', brand: 'STARBUCKS', cantidad_cuotas: 1, deuda_id: 'D-1003',
    estado_deuda: 'pendiente', fecha_compromiso: '2026-05-20', fecha_pago: '2026-06-30',
    monto_total_deuda: 2200000, monto_total_pagado: 0, num_factura: 'FAC-0071',
    observaciones: 'Pago unico acordado.', periodo: 'Mayo 2026', ruc: '80034567-3',
    saldo_pendiente: 2200000, servicio: 'Publicidad digital', tipo_pago: 'unico',
  },
  // A-004 — MARTES DE BURGUER KING / BURGUER KING — 4 cuotas, 2 pagadas
  {
    aliado_id: 'A-004', bolsa: 'MARTES DE BURGUER KING', brand: 'BURGUER KING', cantidad_cuotas: 4, deuda_id: 'D-1004',
    estado_deuda: 'parcial', fecha_compromiso: '2026-03-15', monto_total_deuda: 6000000,
    monto_total_pagado: 3000000, num_factura: 'FAC-0085',
    observaciones: 'Acuerdo trimestral. Mitad abonada.', periodo: 'Marzo-Junio 2026',
    ruc: '80045678-4', saldo_pendiente: 3000000, servicio: 'Publicidad digital',
    tipo_pago: 'cuotas',
  },
  // A-005 — MIERCOLES DE PIZZA HUT / PIZZA HUT — 3 cuotas pendientes
  {
    aliado_id: 'A-005', bolsa: 'MIERCOLES DE PIZZA HUT', brand: 'PIZZA HUT', cantidad_cuotas: 3, deuda_id: 'D-1005',
    estado_deuda: 'pendiente', fecha_compromiso: '2026-06-01', monto_total_deuda: 9000000,
    monto_total_pagado: 0, num_factura: 'FAC-0099',
    observaciones: 'Primer acuerdo del aliado. Sin pagos aun.', periodo: 'Junio 2026',
    ruc: '80056789-5', saldo_pendiente: 9000000, servicio: 'Publicidad digital', tipo_pago: 'cuotas',
  },
  // A-006 — JUEVES DE DON VITO / DON VITO — 2 cuotas pendientes
  {
    aliado_id: 'A-006', bolsa: 'JUEVES DE DON VITO', brand: 'DON VITO', cantidad_cuotas: 2, deuda_id: 'D-1006',
    estado_deuda: 'pendiente', fecha_compromiso: '2026-05-01', monto_total_deuda: 3500000,
    monto_total_pagado: 0, num_factura: 'FAC-0022',
    observaciones: 'Acuerdo reciente. Sin pagos registrados.', periodo: 'Mayo 2026',
    ruc: '80067890-6', saldo_pendiente: 3500000, servicio: 'Publicidad digital', tipo_pago: 'cuotas',
  },
  // A-007 — VIERNES DE LOMY / LOMY — 2 cuotas, 1 parcialmente pagada
  {
    aliado_id: 'A-007', bolsa: 'VIERNES DE LOMY', brand: 'LOMY', cantidad_cuotas: 2, deuda_id: 'D-1008',
    estado_deuda: 'parcial', fecha_compromiso: '2026-04-01', monto_total_deuda: 2600000,
    monto_total_pagado: 600000, num_factura: 'FAC-0110',
    observaciones: 'Primera cuota abonada parcialmente.', periodo: 'Abril-Mayo 2026',
    ruc: '80078901-7', saldo_pendiente: 2000000, servicio: 'Publicidad digital', tipo_pago: 'cuotas',
  },
]

let mockCuotas: CuotaRecord[] = [
  // D-1001 (A-001)
  { cuota_id: 'C-2001', deuda_id: 'D-1001', estado_cuota: 'pagada',   fecha_vencimiento: '2026-05-01', monto_cuota: 1500000, monto_pagado: 1500000, numero_cuota: 1 },
  { cuota_id: 'C-2002', deuda_id: 'D-1001', estado_cuota: 'pendiente', fecha_vencimiento: '2026-06-01', monto_cuota: 1500000, monto_pagado: 0,       numero_cuota: 2 },
  { cuota_id: 'C-2003', deuda_id: 'D-1001', estado_cuota: 'pendiente', fecha_vencimiento: '2026-07-01', monto_cuota: 1500000, monto_pagado: 0,       numero_cuota: 3 },
  // D-1007 (A-001) — pagada
  { cuota_id: 'C-2011', deuda_id: 'D-1007', estado_cuota: 'pagada',   fecha_vencimiento: '2026-03-31', monto_cuota: 800000,  monto_pagado: 800000,  numero_cuota: 1 },
  // D-1002 (A-002)
  { cuota_id: 'C-2004', deuda_id: 'D-1002', estado_cuota: 'pendiente', fecha_vencimiento: '2026-06-15', monto_cuota: 900000,  monto_pagado: 0,       numero_cuota: 1 },
  { cuota_id: 'C-2005', deuda_id: 'D-1002', estado_cuota: 'pendiente', fecha_vencimiento: '2026-07-15', monto_cuota: 900000,  monto_pagado: 0,       numero_cuota: 2 },
  // D-1003 (A-003)
  { cuota_id: 'C-2006', deuda_id: 'D-1003', estado_cuota: 'pendiente', fecha_vencimiento: '2026-06-30', monto_cuota: 2200000, monto_pagado: 0,       numero_cuota: 1 },
  // D-1004 (A-004)
  { cuota_id: 'C-2007', deuda_id: 'D-1004', estado_cuota: 'pagada',   fecha_vencimiento: '2026-04-01', monto_cuota: 1500000, monto_pagado: 1500000, numero_cuota: 1 },
  { cuota_id: 'C-2008', deuda_id: 'D-1004', estado_cuota: 'pagada',   fecha_vencimiento: '2026-05-01', monto_cuota: 1500000, monto_pagado: 1500000, numero_cuota: 2 },
  { cuota_id: 'C-2009', deuda_id: 'D-1004', estado_cuota: 'pendiente', fecha_vencimiento: '2026-06-01', monto_cuota: 1500000, monto_pagado: 0,       numero_cuota: 3 },
  { cuota_id: 'C-2010', deuda_id: 'D-1004', estado_cuota: 'pendiente', fecha_vencimiento: '2026-07-01', monto_cuota: 1500000, monto_pagado: 0,       numero_cuota: 4 },
  // D-1005 (A-005)
  { cuota_id: 'C-2012', deuda_id: 'D-1005', estado_cuota: 'pendiente', fecha_vencimiento: '2026-07-01', monto_cuota: 3000000, monto_pagado: 0,       numero_cuota: 1 },
  { cuota_id: 'C-2013', deuda_id: 'D-1005', estado_cuota: 'pendiente', fecha_vencimiento: '2026-08-01', monto_cuota: 3000000, monto_pagado: 0,       numero_cuota: 2 },
  { cuota_id: 'C-2014', deuda_id: 'D-1005', estado_cuota: 'pendiente', fecha_vencimiento: '2026-09-01', monto_cuota: 3000000, monto_pagado: 0,       numero_cuota: 3 },
  // D-1006 (A-006)
  { cuota_id: 'C-2015', deuda_id: 'D-1006', estado_cuota: 'pendiente', fecha_vencimiento: '2026-06-15', monto_cuota: 1750000, monto_pagado: 0,      numero_cuota: 1 },
  { cuota_id: 'C-2016', deuda_id: 'D-1006', estado_cuota: 'pendiente', fecha_vencimiento: '2026-07-15', monto_cuota: 1750000, monto_pagado: 0,      numero_cuota: 2 },
  // D-1008 (A-007 — LOMY)
  { cuota_id: 'C-2017', deuda_id: 'D-1008', estado_cuota: 'parcial',   fecha_vencimiento: '2026-05-01', monto_cuota: 1300000, monto_pagado: 600000, numero_cuota: 1 },
  { cuota_id: 'C-2018', deuda_id: 'D-1008', estado_cuota: 'pendiente', fecha_vencimiento: '2026-06-01', monto_cuota: 1300000, monto_pagado: 0,      numero_cuota: 2 },
]

let mockPagos: PagoRecord[] = [
  {
    aliado_id: 'A-001', comentario: 'Pago inicial confirmado por tesoreria.',
    comprobante: 'TRX-15001', cuota_id: 'C-2001', deuda_id: 'D-1001',
    fecha_pago: '2026-05-01', medio_pago: 'Transferencia', monto_pagado: 1500000, pago_id: 'P-3001',
  },
  {
    aliado_id: 'A-001', comentario: 'Servicio de marzo cancelado en su totalidad.',
    comprobante: 'TRX-14880', cuota_id: 'C-2011', deuda_id: 'D-1007',
    fecha_pago: '2026-03-30', medio_pago: 'Transferencia', monto_pagado: 800000, pago_id: 'P-3002',
  },
  {
    aliado_id: 'A-004', comentario: 'Primera cuota abonada segun acuerdo.',
    comprobante: 'TRX-16200', cuota_id: 'C-2007', deuda_id: 'D-1004',
    fecha_pago: '2026-04-02', medio_pago: 'Cheque', monto_pagado: 1500000, pago_id: 'P-3003',
  },
  {
    aliado_id: 'A-004', comentario: 'Segunda cuota abonada.',
    comprobante: 'TRX-16450', cuota_id: 'C-2008', deuda_id: 'D-1004',
    fecha_pago: '2026-05-03', medio_pago: 'Transferencia', monto_pagado: 1500000, pago_id: 'P-3004',
  },
  {
    aliado_id: 'A-007', comentario: 'Abono parcial de primera cuota.',
    comprobante: 'TRX-17100', cuota_id: 'C-2017', deuda_id: 'D-1008',
    fecha_pago: '2026-05-05', medio_pago: 'Transferencia', monto_pagado: 600000, pago_id: 'P-3005',
  },
]

function computeSummary(aliadoId: string) {
  const deudas = mockDeudas.filter((d) => String(d.aliado_id) === aliadoId)
  const activa = deudas.find((d) => d.estado_deuda !== 'pagado') ?? deudas[0]
  return {
    bolsa:              activa?.bolsa,
    brand:              activa?.brand,
    deuda_total:        deudas.reduce((s, d) => s + d.monto_total_deuda, 0),
    monto_total_pagado: deudas.reduce((s, d) => s + d.monto_total_pagado, 0),
    ruc:                activa?.ruc,
    saldo_pendiente:    deudas.reduce((s, d) => s + d.saldo_pendiente, 0),
    ultimo_periodo:     activa?.periodo,
  }
}

function computeEstadoGeneral(saldoPendiente: number, deudaTotal: number): EstadoGeneralDeuda {
  if (deudaTotal <= 0)               return 'sin_deuda'
  if (saldoPendiente <= 0)           return 'pagado'
  if (saldoPendiente < deudaTotal)   return 'parcial'
  return 'pendiente'
}

export async function getLocalSessionContext() {
  await new Promise((resolve) => window.setTimeout(resolve, 160))
  return localSessionUser
}

export async function listarAliadosLocal(): Promise<AliadoResumen[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 220))
  return mockAlliesBase.map((ally) => {
    const summary = computeSummary(String(ally.aliado_id))
    return {
      ...ally,
      ...summary,
      estado_general: computeEstadoGeneral(summary.saldo_pendiente, summary.deuda_total),
    }
  })
}

export async function obtenerDetalleAliadoLocal(aliadoId: string | number): Promise<AliadoDetalle> {
  await new Promise((resolve) => window.setTimeout(resolve, 180))
  const ally = mockAlliesBase.find((a) => String(a.aliado_id) === String(aliadoId))
  if (!ally) throw new Error('No encontramos ese aliado en el entorno local.')

  const deudas = mockDeudas.filter((d) => String(d.aliado_id) === String(aliadoId))
  const cuotas = mockCuotas.filter((c) => deudas.some((d) => d.deuda_id === c.deuda_id))
  const pagos  = mockPagos.filter((p) => String(p.aliado_id) === String(aliadoId))

  return { aliado: ally, cuotas, deudas, pagos, resumen: computeSummary(String(aliadoId)) }
}

export async function registrarPagoLocal(payload: RegistrarPagoPayload) {
  await new Promise((resolve) => window.setTimeout(resolve, 240))
  const deuda = mockDeudas.find((d) => d.deuda_id === payload.deudaId)
  if (!deuda) throw new Error('No encontramos la deuda seleccionada en el entorno local.')

  const monto = Number(payload.montoPagado)
  deuda.monto_total_pagado += monto
  deuda.saldo_pendiente = Math.max(0, deuda.saldo_pendiente - monto)
  deuda.estado_deuda =
    deuda.saldo_pendiente <= 0 ? 'pagado' : deuda.monto_total_pagado > 0 ? 'parcial' : 'pendiente'

  if (payload.cuotaId) {
    const cuota = mockCuotas.find((c) => c.cuota_id === payload.cuotaId)
    if (cuota) {
      cuota.monto_pagado += monto
      cuota.estado_cuota = cuota.monto_pagado >= cuota.monto_cuota ? 'pagada' : 'parcial'
    }
  }

  mockPagos = [
    {
      aliado_id:   payload.aliadoId,
      comentario:  payload.comentario,
      comprobante: payload.comprobante,
      cuota_id:    payload.cuotaId,
      deuda_id:    payload.deudaId,
      fecha_pago:  payload.fechaPago,
      medio_pago:  payload.medioPago,
      monto_pagado: monto,
      pago_id:     `P-${Date.now()}`,
    },
    ...mockPagos,
  ]
  return { deuda }
}

export async function crearAcuerdoLocal(payload: CrearAcuerdoPayload) {
  await new Promise((resolve) => window.setTimeout(resolve, 280))
  const deudaId  = `D-${Date.now()}`
  const tipoPago = payload.cuotas.length === 1 ? 'unico' : 'cuotas'

  const nuevaDeuda: DeudaRecord = {
    aliado_id:          payload.aliadoId,
    bolsa:              payload.bolsa,
    brand:              payload.brand,
    cantidad_cuotas:    payload.cuotas.length,
    deuda_id:           deudaId,
    estado_deuda:       'pendiente',
    fecha_compromiso:   payload.fechaCompromiso,
    fecha_pago:         tipoPago === 'unico' ? payload.cuotas[0]?.fecha_pago : undefined,
    monto_total_deuda:  payload.montoTotal,
    monto_total_pagado: 0,
    num_factura:        payload.numFactura,
    observaciones:      payload.observaciones,
    periodo:            payload.periodo,
    ruc:                payload.ruc,
    saldo_pendiente:    payload.montoTotal,
    servicio:           payload.servicio,
    tipo_pago:          tipoPago,
  }

  mockDeudas = [...mockDeudas, nuevaDeuda]

  const nuevasCuotas: CuotaRecord[] = payload.cuotas.map((c, i) => ({
    cuota_id:         `C-${Date.now()}-${i + 1}`,
    deuda_id:         deudaId,
    estado_cuota:     'pendiente',
    fecha_vencimiento: c.fecha_pago,
    monto_cuota:      c.monto_cuota,
    monto_pagado:     0,
    numero_cuota:     c.numero_cuota,
  }))
  mockCuotas = [...mockCuotas, ...nuevasCuotas]

  return { deuda: nuevaDeuda }
}

export async function agregarCuotaLocal(payload: AgregarCuotaPayload) {
  await new Promise((resolve) => window.setTimeout(resolve, 200))
  const deuda = mockDeudas.find((d) => d.deuda_id === payload.deudaId)
  if (!deuda) throw new Error('No encontramos esa deuda en el entorno local.')

  const nextNumero = mockCuotas.filter((c) => c.deuda_id === payload.deudaId).length + 1

  const nuevaCuota: CuotaRecord = {
    cuota_id:          `C-${Date.now()}`,
    deuda_id:          payload.deudaId,
    estado_cuota:      'pendiente',
    fecha_vencimiento: payload.fecha_pago,
    monto_cuota:       payload.monto_cuota,
    monto_pagado:      0,
    numero_cuota:      nextNumero,
  }

  mockCuotas = [...mockCuotas, nuevaCuota]
  deuda.cantidad_cuotas      = nextNumero
  deuda.monto_total_deuda   += payload.monto_cuota
  deuda.saldo_pendiente     += payload.monto_cuota
  deuda.tipo_pago            = 'cuotas'

  return { cuota: nuevaCuota }
}
