export const YM_ID = 110230540;

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

export function reachGoal(goal: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.ym !== "function") return;

  window.ym(YM_ID, "reachGoal", goal, params);
}

export function metrikaHit(url?: string) {
  if (typeof window === "undefined") return;
  if (typeof window.ym !== "function") return;

  window.ym(YM_ID, "hit", url ?? window.location.href);
}
