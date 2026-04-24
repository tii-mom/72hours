import type { ReactNode } from "react";
import { CapitalTonConnectProvider, TonConnectRuntimeSync } from "../lib/tonconnect";

export default function CapitalRouteBoundary({ children }: { children: ReactNode }) {
  return (
    <CapitalTonConnectProvider>
      <TonConnectRuntimeSync />
      {children}
    </CapitalTonConnectProvider>
  );
}
