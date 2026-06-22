"use client";

import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

type ThemeSwitcherVariant = "icon" | "segmented";

type ThemeSwitcherProps = {
  className?: string;
  variant?: ThemeSwitcherVariant;
};

export function ThemeSwitcher({ className, variant = "segmented" }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => setTheme(nextTheme)}
        aria-label="Переключить тему"
        title="Переключить тему"
        className={cn(
          "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] shadow-[0_12px_32px_rgb(var(--text-primary-rgb)/0.10)] backdrop-blur-xl transition duration-200 hover:border-[var(--accent)] hover:shadow-[0_0_0_4px_rgb(var(--accent-rgb)/0.12),0_16px_38px_rgb(var(--accent-rgb)/0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          className
        )}
      >
        {theme === "dark" ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.9 13.5A8 8 0 0 1 10.5 3.1 8 8 0 1 0 20.9 13.5Z" />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 rounded-full border border-primary/10 bg-surface/70 p-1 shadow-[0_14px_38px_rgba(0,0,0,0.12)] backdrop-blur-xl",
        className
      )}
      aria-label="Переключатель темы"
    >
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        title="Темная версия"
        className={cn(
          "inline-flex h-9 items-center justify-center gap-2 rounded-full px-3 text-xs font-bold transition",
          theme === "dark" ? "bg-accent text-white shadow-[0_10px_28px_rgba(62,110,168,0.28)]" : "text-graphite hover:bg-surface hover:text-primary"
        )}
      >
        <span>Темная</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        title="Светлая версия"
        className={cn(
          "inline-flex h-9 items-center justify-center gap-2 rounded-full px-3 text-xs font-bold transition",
          theme === "light" ? "bg-accent text-white shadow-[0_10px_28px_rgba(74,111,165,0.24)]" : "text-graphite hover:bg-surface hover:text-primary"
        )}
      >
        <span>Светлая</span>
      </button>
    </div>
  );
}
