import { THEME, TonConnectUIProvider, useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect, type ReactNode } from "react";
import { useTheme } from "./theme";

const DEFAULT_TONCONNECT_MANIFEST_URL =
  import.meta.env.VITE_TONCONNECT_MANIFEST_URL || "/tonconnect-manifest.json";

export function CapitalTonConnectProvider({ children }: { children: ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={DEFAULT_TONCONNECT_MANIFEST_URL}>
      {children}
    </TonConnectUIProvider>
  );
}

export function TonConnectRuntimeSync() {
  const { theme } = useTheme();
  const [, setOptions] = useTonConnectUI();

  useEffect(() => {
    setOptions({
      uiPreferences: {
        theme: theme === "clarity" ? THEME.LIGHT : THEME.DARK,
      },
      actionsConfiguration: {
        returnStrategy: "back",
      },
    });
  }, [setOptions, theme]);

  return null;
}
