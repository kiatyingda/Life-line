import type { AppData } from "../types";

/**
 * The persistence seam. Implement once per platform:
 *   web    -> LocalStorageStorage (below)
 *   native -> AsyncStorageStorage (Expo: wrap @react-native-async-storage)
 *   cloud  -> SupabaseStorage (Phase 2)
 * UI and store never change when the implementation swaps.
 */
export interface StorageProvider {
  load(): Promise<AppData | null>;
  save(data: AppData): Promise<void>;
  clear(): Promise<void>;
}
