# Loyalty Pagos

Panel operativo para seguimiento de deuda, cuotas y pagos de aliados.

## Arquitectura actual

- Frontend: React + Vite.
- Backend objetivo: Google Apps Script como web app.
- Control de acceso: Google Workspace + pertenencia a grupo usando `Session.getActiveUser()` y `GroupsApp`.

## Desarrollo local

Para trabajar la UI en local:

```bash
npm install
npm run dev
```

La app local usa un backend mock en memoria cuando no existe `google.script.run`, para que puedas seguir iterando el front sin depender del despliegue en Apps Script.

## Build para Apps Script

Genera el build de React e incrusta los assets compilados dentro de [apps-script/Index.html](/Users/alvaro.arambulo/Documents/React-loyalty-facturas-project/apps-script/Index.html):

```bash
npm run build:appscript
```

Ese comando:

1. Ejecuta `vite build`.
2. Lee `dist/index.html` y sus assets.
3. Genera `apps-script/Index.html` listo para `HtmlService`.

## Carpeta `apps-script/`

- [apps-script/Code.gs](/Users/alvaro.arambulo/Documents/React-loyalty-facturas-project/apps-script/Code.gs): `doGet`, control de acceso por grupo y funciones backend.
- [apps-script/Index.html](/Users/alvaro.arambulo/Documents/React-loyalty-facturas-project/apps-script/Index.html): build compilado de React servido por Apps Script.
- [apps-script/AccessDenied.html](/Users/alvaro.arambulo/Documents/React-loyalty-facturas-project/apps-script/AccessDenied.html): pantalla de acceso denegado.
- [apps-script/appsscript.json](/Users/alvaro.arambulo/Documents/React-loyalty-facturas-project/apps-script/appsscript.json): manifiesto del proyecto Apps Script.

## Estado actual del backend Apps Script

La estructura ya queda lista para:

- validar usuarios por grupo corporativo;
- entregar la SPA de React desde Apps Script;
- llamar funciones de backend desde React usando `google.script.run`.

Hoy [apps-script/Code.gs](/Users/alvaro.arambulo/Documents/React-loyalty-facturas-project/apps-script/Code.gs) trae datos mock para `listarAliados` y `obtenerDetalleAliado`, y deja `registrarPago` marcado para conectar con tu hoja/base real.

## Siguiente paso productivo

Mapear en Apps Script las funciones reales:

- `listarAliados`
- `obtenerDetalleAliado`
- `registrarPago`

contra las hojas, tablas o fuentes definitivas del negocio.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
