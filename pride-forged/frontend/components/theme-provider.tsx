"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const THEME_STORAGE_KEY = "pride-forged-theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const urlTheme = isTheme(searchParams.get("theme")) ? searchParams.get("theme") : null;
    const storedTheme = isTheme(window.localStorage.getItem(THEME_STORAGE_KEY))
      ? window.localStorage.getItem(THEME_STORAGE_KEY)
      : null;
    const nextTheme = (urlTheme ?? storedTheme ?? "dark") as Theme;

    applyTheme(nextTheme);
    setThemeState(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }, [searchParams]);

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      applyTheme(nextTheme);
      setThemeState(nextTheme);
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);

      const params = new URLSearchParams(searchParams.toString());
      params.set("theme", nextTheme);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const value = useMemo(() => ({ theme, setTheme }), [setTheme, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
