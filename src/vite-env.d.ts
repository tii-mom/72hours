/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CAPITAL_DATA_MODE?: string;
  readonly VITE_CAPITAL_API_BASE_URL?: string;
  readonly VITE_TONCONNECT_MANIFEST_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
