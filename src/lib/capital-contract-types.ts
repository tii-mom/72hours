export type CapitalAppSlug = "multi-millionaire" | "72hours" | "wan";
export type CapitalSeatType = "reserve" | "alpha";
export type CapitalIntentKind =
  | "reserve.allocate"
  | "reserve.redeem"
  | "alpha.allocate"
  | "reward.claim";
export type CapitalIntentStatus = "preview" | "pending" | "confirmed" | "failed" | "stale";

export interface CapitalIntentUiState {
  disabled: boolean;
  safe: boolean;
  label: string;
  reason: string;
}

export interface CapitalIntentWalletSubmission {
  exists: boolean;
  submittedAt?: string;
  boc?: string;
  explorerUrl?: string;
}

export interface CapitalIntentReferences {
  program: {
    kind: CapitalIntentKind;
    label: string;
    route: string;
  };
  app: {
    slug: CapitalAppSlug;
    name: string;
    surfaceLabel: string;
  };
  seat: {
    type: CapitalSeatType | "reward";
    label: string;
    number?: number;
    visibility: "public-verification" | "private-portfolio";
  };
  contract: {
    alias: string;
    address: string;
  };
}

export interface CapitalIntentNetworkMetadata {
  networkName: "TON";
  chainId: string;
  workchain: number;
  explorerUrl: string;
  mode: "mock" | "testnet" | "mainnet";
}

export interface CapitalIntentResponse {
  intentId: string;
  kind: CapitalIntentKind;
  status: CapitalIntentStatus | "submitted";
  statusLabel: string;
  terminal?: boolean;
  createdAt?: string;
  lastCheckedAt?: string;
  network: string;
  asset: string;
  gasPolicy: string;
  message: string;
  expiresAt: string;
  actionSummary?: {
    title: string;
    body: string;
    effect: string;
    safeNote: string;
  };
  walletRequirements?: {
    provider: string;
    required: boolean;
    connectionLabel: string;
    supportedWallets: string[];
    feePayer: string;
    walletAddress?: string;
  };
  walletSubmission: CapitalIntentWalletSubmission;
  references?: CapitalIntentReferences;
  networkMeta?: CapitalIntentNetworkMetadata;
  uiState: CapitalIntentUiState;
  transactionRequest?: {
    protocol: "ton-connect";
    method: "sendTransaction";
    operation: CapitalIntentKind;
    entrypoint: string;
    payloadEncoding: string;
    scaffold?: {
      version: string;
      encoding: string;
      productionReady: boolean;
      gasPayer?: "user";
      notes?: readonly string[];
    };
    validUntil?: string;
    messages?: Array<{
      address: string;
      amount: string;
      payload?: string;
      comment?: string;
    }>;
  };
  storage?: {
    mode: string;
    recentCount: number;
    updatedAt: string;
  };
  submission?: {
    submitted: boolean;
    status: string;
    statusLabel: string;
    submittedAt?: string;
    boc?: string;
    explorerUrl?: string;
  };
}

export interface CapitalIntentLookupResponse {
  intentId: string;
  kind: CapitalIntentKind;
  status: CapitalIntentStatus;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
  terminal?: boolean;
  lastCheckedAt?: string;
  uiState: CapitalIntentUiState;
  walletSubmission: CapitalIntentWalletSubmission;
  references?: CapitalIntentReferences;
  networkMeta?: CapitalIntentNetworkMetadata;
}

export interface CapitalIntentTrackingPayload {
  intentId: string;
  kind: CapitalIntentKind;
  status: CapitalIntentStatus | "submitted";
  statusLabel: string;
  createdAt?: string;
  updatedAt?: string;
  terminal?: boolean;
  lastCheckedAt?: string;
  uiState?: CapitalIntentUiState;
  submission?: {
    submitted: boolean;
    status: string;
    statusLabel: string;
    submittedAt?: string;
    boc?: string;
    explorerUrl?: string;
  };
  references?: CapitalIntentReferences;
  networkMeta?: CapitalIntentNetworkMetadata;
}
