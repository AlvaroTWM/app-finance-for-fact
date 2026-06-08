import type {
  AgregarCuotaPayload,
  AliadoDetalle,
  AliadoResumen,
  CrearAcuerdoPayload,
  RegistrarPagoPayload,
} from '../types/appScript'
import {
  agregarCuotaBackend,
  crearAcuerdoBackend,
  listarAliadosBackend,
  obtenerDetalleAliadoBackend,
  registrarPagoBackend,
} from './loyaltyBackend'

export async function listarAliados() {
  return listarAliadosBackend() as Promise<AliadoResumen[]>
}

export async function obtenerDetalleAliado(aliadoId: string | number) {
  return obtenerDetalleAliadoBackend(aliadoId) as Promise<AliadoDetalle>
}

export async function registrarPago(payload: RegistrarPagoPayload) {
  return registrarPagoBackend(payload)
}

export async function crearAcuerdo(payload: CrearAcuerdoPayload) {
  return crearAcuerdoBackend(payload)
}

export async function agregarCuota(payload: AgregarCuotaPayload) {
  return agregarCuotaBackend(payload)
}
