"use client";

import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

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
