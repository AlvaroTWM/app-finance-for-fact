import { useEffect, useState } from 'react'

import {
  agregarCuota,
  crearAcuerdo,
  listarAliados,
  obtenerDetalleAliado,
  registrarPago,
} from '../services/appScriptApi'
import type {
  AgregarCuotaPayload,
  AliadoDetalle,
  AliadoResumen,
  CrearAcuerdoPayload,
  RegistrarPagoPayload,
} from '../types/appScript'

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Ocurrio un error inesperado al cargar el panel.'
}

export function useAllies() {
  const [allies, setAllies] = useState<AliadoResumen[]>([])
  const [selectedAllyId, setSelectedAllyId] = useState<string | number | null>(null)
  const [selectedAllyDetail, setSelectedAllyDetail] = useState<AliadoDetalle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAllies = async () => {
    setIsLoading(true)
    setError(null)
    try {
      setAllies(await listarAliados())
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { void fetchAllies() }, [])

  const loadAllyDetail = async (allyId: string | number) => {
    setIsDetailLoading(true)
    setError(null)
    try {
      setSelectedAllyDetail(await obtenerDetalleAliado(allyId))
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setIsDetailLoading(false)
    }
  }

  const selectAlly = async (allyId: string | number) => {
    setSelectedAllyId(allyId)
    await loadAllyDetail(allyId)
  }

  const refreshDetail = async () => {
    if (selectedAllyId !== null) await loadAllyDetail(selectedAllyId)
  }

  const registerPayment = async (payload: RegistrarPagoPayload) => {
    setError(null)
    try {
      await registrarPago(payload)
      await fetchAllies()
      await refreshDetail()
    } catch (e) {
      const msg = getErrorMessage(e)
      setError(msg)
      throw new Error(msg)
    }
  }

  const createAgreement = async (payload: CrearAcuerdoPayload) => {
    setError(null)
    try {
      await crearAcuerdo(payload)
      await fetchAllies()
      await refreshDetail()
    } catch (e) {
      const msg = getErrorMessage(e)
      setError(msg)
      throw new Error(msg)
    }
  }

  const addCuota = async (payload: AgregarCuotaPayload) => {
    setError(null)
    try {
      await agregarCuota(payload)
      await fetchAllies()
      await refreshDetail()
    } catch (e) {
      const msg = getErrorMessage(e)
      setError(msg)
      throw new Error(msg)
    }
  }

  return {
    addCuota,
    allies,
    createAgreement,
    error,
    isDetailLoading,
    isLoading,
    registerPayment,
    refetch: fetchAllies,
    selectedAllyDetail,
    selectedAllyId,
    selectAlly,
  }
}
