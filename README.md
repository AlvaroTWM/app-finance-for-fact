# Loyalty Pagos

Aplicacion MERN para carga y monitoreo de pagos pendientes entre Aliados y Administradores de Alianzas.

## Frontend

```bash
npm run dev
```

## Backend

La base del backend vive en `server/` e incluye Express, TypeScript, modelos iniciales, health check y un modo seguro temporal sin MongoDB.

Para instalar dependencias del backend:

```bash
npm install --prefix server
```

Configura variables:

```bash
cp server/.env.example server/.env
```

Levantar API:

```bash
npm run server:dev
```

Por defecto corre en modo seguro temporal:

- Escucha solo en `127.0.0.1`.
- No conecta MongoDB.
- Guarda pagos en memoria.
- No guarda imagenes en disco.
- Valida imagenes con limite de 5MB y tipos `PNG`, `JPG`, `WEBP`.
- Devuelve una URL placeholder para `url_imagen`.

Health check:

```bash
GET http://127.0.0.1:3000/api/health
```

Modelos iniciales:

- `User`: usuarios con roles `Aliado` o `Alianzas`.
- `Invoice`: pagos con comercio, monto, evidencia, estado y aliado.
- `Commerce`: catalogo simple de comercios.

Endpoints temporales:

- `GET /api/invoices`
- `POST /api/invoices`
- `PATCH /api/invoices/:invoiceId/verify`
- `PATCH /api/invoices/:invoiceId/reject`
- `POST /api/payments/import`

## Variables Para Deploy

### Frontend en Vercel

Como ahora usamos Vercel Functions en el mismo proyecto, puedes dejar el frontend apuntando a la API del mismo dominio:

```bash
VITE_API_URL=/api
```

Tambien puedes omitir `VITE_API_URL`, porque el frontend usa `/api` por defecto.

Agrega estas variables secretas en `Project Settings > Environment Variables`:

```bash
MONGODB_URI=mongodb+srv://loyalty_app_user:<URL_ENCODED_PASSWORD>@loyalty-pagos-dev.n3peaqd.mongodb.net/loyalty_pagos?retryWrites=true&w=majority&appName=loyalty-pagos-dev
CLIENT_ORIGINS=https://julianxloyalty.vercel.app,http://127.0.0.1:5173,http://localhost:5173
```

No uses `http://127.0.0.1:3000/api` en Vercel, porque esa URL solo funciona en tu computadora.

### API en Vercel Functions

La carpeta `api/` contiene endpoints serverless para la demo:

- `GET /api/health`
- `GET /api/invoices`
- `POST /api/invoices`
- `PATCH /api/invoices/:invoiceId/verify`
- `PATCH /api/invoices/:invoiceId/reject`
- `POST /api/payments/import`

En esta demo las evidencias y archivos Excel no se almacenan; se guarda metadata y una URL placeholder.

### Backend

Cuando el backend este deployado, usa variables como estas:

```bash
PORT=3000
HOST=0.0.0.0
USE_MOCK_DB=false
MONGODB_URI=mongodb+srv://loyalty_app_user:<URL_ENCODED_PASSWORD>@loyalty-pagos-dev.n3peaqd.mongodb.net/loyalty_pagos?retryWrites=true&w=majority&appName=loyalty-pagos-dev
CLIENT_ORIGINS=https://julianxloyalty.vercel.app,http://127.0.0.1:5173,http://localhost:5173
```

En local puedes mantener:

```bash
HOST=127.0.0.1
VITE_API_URL=http://127.0.0.1:3000/api
```

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
