/// <reference types="vite/client" />
/// <reference path="../auto-imports.d.ts" />
/// <reference path="../components.d.ts" />
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_API_URL: string
  readonly BASE_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}