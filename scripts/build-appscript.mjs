import fs from 'node:fs/promises'
import path from 'node:path'

const workspaceRoot = process.cwd()
const distDir = path.join(workspaceRoot, 'dist')
const appsScriptDir = path.join(workspaceRoot, 'apps-script')
const distIndexPath = path.join(distDir, 'index.html')
const appsScriptIndexPath = path.join(appsScriptDir, 'Index.html')
const appsScriptStylesPath = path.join(appsScriptDir, 'AppStyles.html')
const appsScriptBundlePath = path.join(appsScriptDir, 'AppBundle.html')

function escapeInlineScript(source) {
  return source.replace(/<\/script>/gi, '<\\/script>')
}

function extractAssetPath(indexHtml, pattern, label) {
  const match = indexHtml.match(pattern)

  if (!match?.[1]) {
    throw new Error(`No pudimos encontrar el asset de ${label} en dist/index.html.`)
  }

  return match[1].replace(/^\//, '')
}

function assertNoModuleSyntax(jsSource) {
  // Apps Script no ejecuta modulos ES, asi que el bundle debe ser clasico (IIFE).
  // Si Vite emite import.meta o import/export, el script fallaria en silencio.
  const offenders = [
    { label: 'import.meta', pattern: /\bimport\.meta\b/ },
    { label: 'sentencia import', pattern: /(^|[;{}\s])import\s*[*{("'`]/ },
    { label: 'sentencia export', pattern: /(^|[;{}\s])export\s*[*{]/ },
  ]

  for (const offender of offenders) {
    if (offender.pattern.test(jsSource)) {
      throw new Error(
        `El bundle contiene "${offender.label}", que Apps Script no soporta. ` +
          'Revisa la config de Vite (build.rollupOptions.output.format = "iife").',
      )
    }
  }
}

async function buildAppsScriptHtml() {
  const indexHtml = await fs.readFile(distIndexPath, 'utf8')
  const cssAssetPath = extractAssetPath(indexHtml, /<link[^>]+href="\/([^"]+\.css)"/, 'CSS')
  const jsAssetPath = extractAssetPath(indexHtml, /<script[^>]+src="\/([^"]+\.js)"/, 'JavaScript')

  const [cssSource, jsSource] = await Promise.all([
    fs.readFile(path.join(distDir, cssAssetPath), 'utf8'),
    fs.readFile(path.join(distDir, jsAssetPath), 'utf8'),
  ])

  assertNoModuleSyntax(jsSource)

  const titleMatch = indexHtml.match(/<title>([^<]+)<\/title>/i)
  const title = titleMatch?.[1] ?? 'Loyalty Pagos'

  const indexOutput = `<!doctype html>
<html lang="es">
  <head>
    <base target="_top">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <title>${title}</title>
  </head>
  <body>
    <div id="root">
      <main style="min-height:100vh;display:grid;place-items:center;font-family:Arial,sans-serif;color:#0f172a;background:#f4fff8">
        <p style="font-weight:700">Cargando Loyalty HUB...</p>
      </main>
    </div>
    <script>
      function showLoadError(error) {
        var root = document.getElementById('root');
        var message = error && error.message ? error.message : String(error || 'Error desconocido');
        root.innerHTML =
          '<main style="min-height:100vh;display:grid;place-items:center;padding:24px;font-family:Arial,sans-serif;color:#0f172a;background:#f4fff8">' +
            '<section style="max-width:640px;border:1px solid rgba(2,44,34,.15);border-radius:28px;background:white;padding:28px;text-align:center;box-shadow:0 24px 70px rgba(15,23,42,.08)">' +
              '<p style="margin:0 0 12px;font-size:12px;font-weight:900;letter-spacing:.2em;color:#047857;text-transform:uppercase">Loyalty HUB</p>' +
              '<h1 style="margin:0;font-size:24px;font-weight:900">No pudimos cargar la aplicacion</h1>' +
              '<p style="margin:16px 0 0;font-size:14px;line-height:1.5;color:#475569;white-space:pre-wrap">' + message + '</p>' +
            '</section>' +
          '</main>';
      }

      window.onerror = function(message, source, line, column, error) {
        showLoadError(error || message);
      };

      window.onunhandledrejection = function(event) {
        showLoadError(event.reason || event);
      };

      function loadBundle() {
        google.script.run
          .withFailureHandler(function(error) {
            showLoadError(error);
          })
          .withSuccessHandler(function(source) {
            try {
              var script = document.createElement('script');
              script.textContent = source;
              document.body.appendChild(script);
            } catch (error) {
              showLoadError(error);
            }
          })
          .getClientBundle();
      }

      try {
        google.script.run
          .withFailureHandler(function() {
            loadBundle();
          })
          .withSuccessHandler(function(stylesSource) {
            var style = document.createElement('style');
            style.textContent = stylesSource;
            document.head.appendChild(style);
            loadBundle();
          })
          .getClientStyles();
      } catch (error) {
        loadBundle();
      }
    </script>
  </body>
</html>
`

  const stylesOutput = `<style>
${cssSource}
</style>
`

  // AppBundle debe ser HTML valido para Apps Script. getClientBundle() en Code.gs
  // remueve estas etiquetas antes de ejecutar el codigo en el navegador.
  const bundleOutput = `<script>
${escapeInlineScript(jsSource)}
</script>
`

  await fs.mkdir(appsScriptDir, { recursive: true })
  await Promise.all(
    [
      fs.writeFile(appsScriptIndexPath, indexOutput, 'utf8'),
      fs.writeFile(appsScriptStylesPath, stylesOutput, 'utf8'),
      fs.writeFile(appsScriptBundlePath, bundleOutput, 'utf8'),
    ],
  )

  process.stdout.write(`Generated ${path.relative(workspaceRoot, appsScriptIndexPath)}\n`)
  process.stdout.write(`Generated ${path.relative(workspaceRoot, appsScriptStylesPath)}\n`)
  process.stdout.write(`Generated ${path.relative(workspaceRoot, appsScriptBundlePath)}\n`)
}

await buildAppsScriptHtml()
