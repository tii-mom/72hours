import type { CapitalRuntimeMode } from "./capital-query";

type CapitalRuntimeEnvKey = "VITE_CAPITAL_DATA_MODE" | "VITE_CAPITAL_API_BASE_URL";
type CapitalRuntimeEnv = Partial<Record<CapitalRuntimeEnvKey, string>>;

type ImportMetaWithEnv = ImportMeta & {
  env?: Record<string, string | boolean | undefined>;
};

export interface CapitalRuntimeConfig {
  mode: CapitalRuntimeMode;
  apiBaseUrl: string;
}

export interface CapitalRuntimeOverrides {
  mode?: CapitalRuntimeMode;
  apiBaseUrl?: string;
}

export const DEFAULT_CAPITAL_RUNTIME_MODE: CapitalRuntimeMode = "preview";
export const DEFAULT_CAPITAL_API_BASE_URL = "/v1/capital";

function toOptionalString(value: string | boolean | undefined) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "boolean") {
    return String(value);
  }

  return undefined;
}

function readCapitalRuntimeEnv(): CapitalRuntimeEnv {
  const env: Record<string, string | boolean | undefined> = (import.meta as ImportMetaWithEnv).env ?? {};

  return {
    VITE_CAPITAL_DATA_MODE: toOptionalString(env.VITE_CAPITAL_DATA_MODE),
    VITE_CAPITAL_API_BASE_URL: toOptionalString(env.VITE_CAPITAL_API_BASE_URL),
  };
}

export function resolveCapitalRuntimeMode(value?: string): CapitalRuntimeMode {
  switch (value?.trim().toLowerCase()) {
    case "api":
      return "api";
    case "mock":
    case "preview":
      return "preview";
    default:
      return DEFAULT_CAPITAL_RUNTIME_MODE;
  }
}

function normalizeCapitalApiBaseUrl(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return DEFAULT_CAPITAL_API_BASE_URL;
  }

  if (trimmed === "/") {
    return trimmed;
  }

  return trimmed.replace(/\/+$/, "");
}

export function getCapitalRuntimeConfig(overrides: CapitalRuntimeOverrides = {}): CapitalRuntimeConfig {
  const env = readCapitalRuntimeEnv();

  return {
    mode: overrides.mode ?? resolveCapitalRuntimeMode(env.VITE_CAPITAL_DATA_MODE),
    apiBaseUrl: overrides.apiBaseUrl ?? normalizeCapitalApiBaseUrl(env.VITE_CAPITAL_API_BASE_URL),
  };
}

export function isCapitalApiMode(config: CapitalRuntimeConfig = getCapitalRuntimeConfig()) {
  return config.mode === "api";
}

export type { CapitalRuntimeMode } from "./capital-query";
