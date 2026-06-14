import type { AppData } from "../types";
import type { StorageProvider } from "./provider";

/** Used during SSR, tests, and as a native fallback. */
export class InMemoryStorage implements StorageProvider {
  private data: AppData | null = null;
  async load(): Promise<AppData | null> {
    return this.data;
  }
  async save(data: AppData): Promise<void> {
    this.data = data;
  }
  async clear(): Promise<void> {
    this.data = null;
  }
}
