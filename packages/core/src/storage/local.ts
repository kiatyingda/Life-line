import type { AppData } from "../types";
import type { StorageProvider } from "./provider";

export const STORAGE_KEY = "lifelines:data:v1";

/** Minimal Web Storage shape — avoids pulling the DOM lib into platform-neutral core. */
interface WebStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function getLocalStorage(): WebStorageLike | null {
  const g = globalThis as unknown as { localStorage?: WebStorageLike };
  return g.localStorage ?? null;
}

/** Web binding. SSR/native-safe — no-ops when localStorage is unavailable. */
export class LocalStorageStorage implements StorageProvider {
  async load(): Promise<AppData | null> {
    const ls = getLocalStorage();
    if (!ls) return null;
    try {
      const raw = ls.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AppData) : null;
    } catch {
      return null;
    }
  }
  async save(data: AppData): Promise<void> {
    const ls = getLocalStorage();
    if (!ls) return;
    try {
      ls.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* quota / private mode — ignore */
    }
  }
  async clear(): Promise<void> {
    const ls = getLocalStorage();
    if (!ls) return;
    try {
      ls.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}
