import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Storage } from '@reown/appkit-react-native';

// Plain JSON.parse/stringify instead of @walletconnect/safe-json (used by
// Reown's own example) - AsyncStorage already guarantees string-only
// storage, so a safe-json dependency buys nothing here beyond what a
// try/catch already covers.
function decode<T>(raw: string | null): T | undefined {
  if (raw === null) return undefined;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export const asyncStorageAdapter: Storage = {
  async getKeys() {
    return [...(await AsyncStorage.getAllKeys())];
  },

  async getEntries<T = unknown>(): Promise<[string, T][]> {
    const keys = await AsyncStorage.getAllKeys();
    const pairs = await AsyncStorage.multiGet(keys);
    const entries: [string, T][] = [];

    for (const [key, value] of pairs) {
      const decoded = decode<T>(value);
      if (decoded !== undefined) {
        entries.push([key, decoded]);
      }
    }

    return entries;
  },

  async getItem<T>(key: string) {
    return decode<T>(await AsyncStorage.getItem(key));
  },

  async setItem<T>(key: string, value: T) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
  },
};
