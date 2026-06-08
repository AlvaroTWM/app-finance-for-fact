import express, { Router } from 'express'

const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyzgFa9jeG66taaSVpAM8DXHu7McQxuaF9Ma-dhG1frkYhOzZwbwTNVIIxptF1LIlROkA/exec'

export const appsScriptRouter = Router()

function getAppsScriptUrl() {
  return process.env.APPS_SCRIPT_URL ?? DEFAULT_APPS_SCRIPT_URL
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

function getUpstreamAuthMessage() {
  return 'El Apps Script configurado requiere iniciar sesion en Google. Publica el web app para acceso externo o configura una URL publica en APPS_SCRIPT_URL.'
}

function getForwardHeaders(authorizationHeader?: string) {
  return {
    Accept: 'application/json',
    ...(authorizationHeader ? { Authorization: authorizationHeader } : {}),
  }
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

appsScriptRouter.use(express.urlencoded({ extended: true }))

appsScriptRouter.get('/apps-script', async (request, response, next) => {
  try {
    const targetUrl = new URL(getAppsScriptUrl())

    Object.entries(request.query).forEach(([key, value]) => {
      appendSearchParam(targetUrl.searchParams, key, value)
    })

    const upstreamResponse = await fetch(targetUrl.toString(), {
      headers: getForwardHeaders(request.header('authorization')),
      redirect: 'manual',
    })

    if (!upstreamResponse.ok) {
      response.status(502).json({
        error: await getUpstreamErrorMessage(upstreamResponse),
        ok: false,
      })
      return
    }

    response.status(200).json(await upstreamResponse.json())
  } catch (error) {
    next(error)
  }
})

appsScriptRouter.post('/apps-script', async (request, response, next) => {
  try {
    const body = new URLSearchParams()

    Object.entries(request.body as Record<string, unknown>).forEach(([key, value]) => {
      appendSearchParam(body, key, value)
    })

    const upstreamResponse = await fetch(getAppsScriptUrl(), {
      body: body.toString(),
      headers: {
        ...getForwardHeaders(request.header('authorization')),
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

    response.status(200).json(await upstreamResponse.json())
  } catch (error) {
    next(error)
  }
})
