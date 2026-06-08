function normalizeAppsScriptError(error: unknown) {
  if (error instanceof Error) {
    return error
  }

  if (typeof error === 'string') {
    return new Error(error)
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = error.message

    if (typeof message === 'string') {
      return new Error(message)
    }
  }

  return new Error('Ocurrio un error inesperado al comunicarnos con Apps Script.')
}

export function hasAppsScriptRuntime() {
  return Boolean(window.google?.script?.run)
}

export function callAppsScript<T>(methodName: string, ...args: unknown[]): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const runtime = window.google?.script?.run

    if (!runtime) {
      reject(new Error('Apps Script no esta disponible en este entorno.'))
      return
    }

    const runner = runtime
      .withFailureHandler((error: unknown) => {
        reject(normalizeAppsScriptError(error))
      })
      .withSuccessHandler((result: T) => {
        resolve(result)
      })

    const method = runner[methodName]

    if (typeof method !== 'function') {
      reject(new Error(`La funcion ${methodName} no esta disponible en Apps Script.`))
      return
    }

    method(...args)
  })
}
