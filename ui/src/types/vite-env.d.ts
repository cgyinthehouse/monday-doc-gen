/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MONDAY_API_KEY: string
    readonly VITE_APP_TITLE: string
    readonly VITE_NGROK_DOCGEN_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}