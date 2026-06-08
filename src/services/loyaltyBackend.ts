import type {
  AgregarCuotaPayload,
  AliadoDetalle,
  AliadoResumen,
  CrearAcuerdoPayload,
  RegistrarPagoPayload,
} from '../types/appScript'
import type { AuthUser } from '../types/auth'
import { callAppsScript, hasAppsScriptRuntime } from './appsScriptRuntime'
import {
  agregarCuotaLocal,
  crearAcuerdoLocal,
  getLocalSessionContext,
  listarAliadosLocal,
  obtenerDetalleAliadoLocal,
  registrarPagoLocal,
} from './localAlliesMock'

export async function getSessionContext(): Promise<AuthUser> {
  if (hasAppsScriptRuntime()) return callAppsScript<AuthUser>('getSessionContext')
  return getLocalSessionContext()
}

export async function listarAliadosBackend(): Promise<AliadoResumen[]> {
  if (hasAppsScriptRuntime()) return callAppsScript<AliadoResumen[]>('listarAliados')
  return listarAliadosLocal()
}

export async function obtenerDetalleAliadoBackend(
  aliadoId: string | number,
): Promise<AliadoDetalle> {
  if (hasAppsScriptRuntime()) return callAppsScript<AliadoDetalle>('obtenerDetalleAliado', String(aliadoId))
  return obtenerDetalleAliadoLocal(aliadoId)
}

export async function registrarPagoBackend(payload: RegistrarPagoPayload) {
  if (hasAppsScriptRuntime()) return callAppsScript<{ deuda: unknown }>('registrarPago', payload)
  return registrarPagoLocal(payload)
}

export async function crearAcuerdoBackend(payload: CrearAcuerdoPayload) {
  if (hasAppsScriptRuntime()) return callAppsScript<{ deuda: unknown }>('crearAcuerdo', payload)
  return crearAcuerdoLocal(payload)
}

export async function agregarCuotaBackend(payload: AgregarCuotaPayload) {
  if (hasAppsScriptRuntime()) return callAppsScript<{ cuota: unknown }>('agregarCuota', payload)
  return agregarCuotaLocal(payload)
}
