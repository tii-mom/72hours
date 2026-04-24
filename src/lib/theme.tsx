import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type ThemeMode = "signal" | "clarity";

const STORAGE_KEY = "72hours.theme";

const THEME_COLORS: Record<ThemeMode, string> = {
  signal: "#030604",
  clarity: "#f6f7f1",
};

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (next: ThemeMode) => void;
  toggleTheme: () => void;
  isClarity: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function normalizeTheme(value: string | null): ThemeMode | null {
  return value === "signal" || value === "clarity" ? value : null;
}

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "signal";
  return normalizeTheme(window.localStorage.getItem(STORAGE_KEY)) ?? "signal";
}

function setThemeColor(theme: ThemeMode) {
  let tag = document.head.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "theme-color");
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", THEME_COLORS[theme]);
}

export function getThemeColor(theme: ThemeMode) {
  return THEME_COLORS[theme];
}

export function applyThemeToDocument(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "clarity" ? "light" : "dark";
  setThemeColor(theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
    applyThemeToDocument(theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((current) => (current === "signal" ? "clarity" : "signal")),
      isClarity: theme === "clarity",
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return value;
}
