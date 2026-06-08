export type EstadoGeneralDeuda = 'sin_deuda' | 'pendiente' | 'parcial' | 'pagado'
export type TipoPago = 'unico' | 'cuotas'

export interface AliadoResumen {
  aliado_id: number | string
  nombre_aliado: string
  estado: string
  deuda_total: number
  monto_total_pagado: number
  saldo_pendiente: number
  estado_general: EstadoGeneralDeuda
  /** Campos representativos del aliado, tomados de su deuda más reciente */
  bolsa?: string
  brand?: string
  ruc?: string
  ultimo_periodo?: string
}

export interface DeudaRecord {
  deuda_id: string
  aliado_id: number | string
  tipo_pago: TipoPago
  monto_total_deuda: number
  cantidad_cuotas: number
  monto_total_pagado: number
  saldo_pendiente: number
  estado_deuda: EstadoGeneralDeuda | string
  /** Fecha en que se acordó el compromiso */
  fecha_compromiso: string
  /** Solo para tipo_pago = 'unico': fecha acordada de pago */
  fecha_pago?: string
  observaciones?: string
  /** Campos de identificación de la factura / servicio */
  bolsa?: string
  brand?: string
  ruc?: string
  periodo?: string
  num_factura?: string
  servicio?: string
}

export interface CuotaRecord {
  cuota_id: string
  deuda_id: string
  numero_cuota: number
  monto_cuota: number
  /** Fecha acordada de pago para esta cuota */
  fecha_vencimiento: string
  estado_cuota: string
  monto_pagado: number
}

export interface PagoRecord {
  pago_id: string
  aliado_id: number | string
  deuda_id: string
  cuota_id?: string
  fecha_pago: string
  monto_pagado: number
  medio_pago?: string
  comprobante?: string
  comentario?: string
}

export interface AliadoDetalle {
  aliado: {
    aliado_id: number | string
    nombre_aliado: string
    estado: string
  }
  deudas: DeudaRecord[]
  cuotas: CuotaRecord[]
  pagos: PagoRecord[]
  resumen: {
    deuda_total: number
    monto_total_pagado: number
    saldo_pendiente: number
  }
}

export interface AppScriptResponse<T> {
  ok: boolean
  data: T
  error?: string
}

/** Registra un desembolso real contra una deuda/cuota existente */
export interface RegistrarPagoPayload {
  aliadoId: string
  comentario?: string
  comprobante?: string
  cuotaId?: string
  deudaId: string
  fechaPago: string
  medioPago?: string
  montoPagado: number
}

/** Cuota a comprometer al crear un acuerdo */
export interface CuotaInput {
  numero_cuota: number
  monto_cuota: number
  /** Fecha acordada de pago para esta cuota */
  fecha_pago: string
}

/** Crea un nuevo acuerdo de pago (adición al tablero) */
export interface CrearAcuerdoPayload {
  aliadoId: string
  montoTotal: number
  /** Fecha en que se acordó el compromiso */
  fechaCompromiso: string
  cuotas: CuotaInput[]
  observaciones?: string
  /** Campos de factura / identificación */
  bolsa?: string
  brand?: string
  ruc?: string
  periodo?: string
  numFactura?: string
  servicio?: string
}

/** Agrega una cuota extra a una deuda existente */
export interface AgregarCuotaPayload {
  deudaId: string
  monto_cuota: number
  fecha_pago: string
}
