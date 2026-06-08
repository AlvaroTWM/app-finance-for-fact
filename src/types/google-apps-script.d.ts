interface GoogleAppsScriptRunner {
  withFailureHandler: (handler: (error: unknown) => void) => GoogleAppsScriptRunner
  withSuccessHandler: <T>(handler: (result: T) => void) => GoogleAppsScriptRunner
  [key: string]: unknown
}

interface GoogleScriptApi {
  run: GoogleAppsScriptRunner
}

interface GoogleApi {
  script?: GoogleScriptApi
}
