import type { HoursBalanceVerification } from "./hours-balance";

export type HoursVerificationSubject =
  | "learn_entry"
  | "capital_reserve"
  | "capital_alpha"
  | "vibe_online"
  | "vibe_offline"
  | "founder_dinner_auction";

export type HoursVerificationRecord = {
  address: string;
  balance?: number;
  createdAt: string;
  id: string;
  source: HoursBalanceVerification["source"];
  status: HoursBalanceVerification["status"];
  subject: HoursVerificationSubject;
  threshold: number;
  tokenContract: string;
};

const STORAGE_KEY = "72h:verification-records";

function readStoredRecords() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed as HoursVerificationRecord[] : [];
  } catch {
    return [];
  }
}

function writeStoredRecord(record: HoursVerificationRecord) {
  const records = [record, ...readStoredRecords()].slice(0, 20);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export async function recordHoursVerification({
  address,
  result,
  subject,
  threshold,
  tokenContract,
}: {
  address: string;
  result: HoursBalanceVerification;
  subject: HoursVerificationSubject;
  threshold: number;
  tokenContract: string;
}) {
  const record: HoursVerificationRecord = {
    address,
    balance: result.balance,
    createdAt: new Date().toISOString(),
    id: crypto.randomUUID(),
    source: result.source,
    status: result.status,
    subject,
    threshold,
    tokenContract,
  };

  writeStoredRecord(record);

  try {
    await fetch("/api/72h-verifications", {
      body: JSON.stringify(record),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });
  } catch {
    // Local storage is the offline trace; remote write is best-effort for static preview and local dev.
  }

  return record;
}
