import { handleOptions, setCorsHeaders } from './_lib/cors'
import type { ApiRequest, ApiResponse } from './_lib/http'
import { isRecord } from './_lib/http'

const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/a/macros/itti.digital/s/AKfycbyzgFa9jeG66taaSVpAM8DXHu7McQxuaF9Ma-dhG1frkYhOzZwbwTNVIIxptF1LIlROkA/exec'

function getAppsScriptUrl() {
  return process.env.APPS_SCRIPT_URL ?? process.env.VITE_APPS_SCRIPT_URL ?? DEFAULT_APPS_SCRIPT_URL
}

function appendSearchParam(params: URLSearchParams, key: string, value: unknown) {
  if (value === undefined || value === null || value === '') {
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item) => appendSearchParam(params, key, item))
    return
  }

  params.append(key, String(value))
}

function buildQueryParams(query: ApiRequest['query']) {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    appendSearchParam(params, key, value)
  })

  return params
}

function buildFormBody(body: unknown) {
  if (typeof body === 'string') {
    return new URLSearchParams(body)
  }

  const params = new URLSearchParams()

  if (!isRecord(body)) {
    return params
  }

  Object.entries(body).forEach(([key, value]) => {
    appendSearchParam(params, key, value)
  })

  return params
}

function getAuthorizationHeader(headers: ApiRequest['headers']) {
  const authorization = headers.authorization
  return Array.isArray(authorization) ? authorization[0] : authorization
}

function getForwardHeaders(authorizationHeader?: string) {
  return {
    Accept: 'application/json',
    ...(authorizationHeader ? { Authorization: authorizationHeader } : {}),
  }
}

async function proxyGet(request: ApiRequest, response: ApiResponse) {
  const targetUrl = new URL(getAppsScriptUrl())
  const params = buildQueryParams(request.query)
  targetUrl.search = params.toString()

  const upstreamResponse = await fetch(targetUrl.toString(), {
    headers: getForwardHeaders(getAuthorizationHeader(request.headers)),
    redirect: 'manual',
  })

  if (!upstreamResponse.ok) {
    response.status(502).json({
      error: await getUpstreamErrorMessage(upstreamResponse),
      ok: false,
    })
    return
  }

  const data = await upstreamResponse.json()
  response.status(upstreamResponse.status).json(data)
}

async function proxyPost(request: ApiRequest, response: ApiResponse) {
  const upstreamResponse = await fetch(getAppsScriptUrl(), {
    body: buildFormBody(request.body).toString(),
    headers: {
      ...getForwardHeaders(getAuthorizationHeader(request.headers)),
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    method: 'POST',
    redirect: 'manual',
  })

  if (!upstreamResponse.ok) {
    response.status(502).json({
      error: await getUpstreamErrorMessage(upstreamResponse),
      ok: false,
    })
    return
  }

  const data = await upstreamResponse.json()
  response.status(upstreamResponse.status).json(data)
}

function getUpstreamAuthMessage() {
  return 'El Apps Script configurado requiere iniciar sesion en Google. Publica el web app para acceso externo o configura una URL publica en APPS_SCRIPT_URL.'
}

function isGoogleLoginRedirect(response: Response) {
  const location = response.headers.get('location') ?? ''
  return response.status >= 300 && response.status < 400 && location.includes('accounts.google.com')
}

async function getUpstreamErrorMessage(response: Response) {
  if (isGoogleLoginRedirect(response)) {
    return getUpstreamAuthMessage()
  }

  const text = await response.text()
  return text.trim() || 'No pudimos comunicarnos con Google Apps Script.'
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method === 'OPTIONS') {
    handleOptions(request, response)
    return
  }

  setCorsHeaders(request, response)

  try {
    if (request.method === 'GET') {
      await proxyGet(request, response)
      return
    }

    if (request.method === 'POST') {
      await proxyPost(request, response)
      return
    }

    response.status(405).json({ message: 'Metodo no permitido.' })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'No pudimos comunicarnos con Google Apps Script.'

    response.status(502).json({
      error: message,
      ok: false,
    })
  }
}
