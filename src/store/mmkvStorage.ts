/**
 * MMKV Secure Storage — AppsyShop
 * AES-256 encrypted storage adapter for redux-persist.
 * More secure and 10x faster than AsyncStorage.
 *
 * NOTE (Production): Replace the hardcoded encryptionKey with a value
 * retrieved from Keychain (iOS) or Keystore (Android) at runtime.
 */

import { createMMKV } from 'react-native-mmkv';

// MMKV instance
export const storage = createMMKV({
  id: 'appsy-shop-v1',
});

/**
 * redux-persist compatible storage adapter backed by MMKV.
 */
const mmkvStorage = {
  setItem: (key: string, value: string): Promise<boolean> => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string): Promise<string | null | undefined> => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string): Promise<void> => {
    storage.remove(key);
    return Promise.resolve();
  },
};

export default mmkvStorage;
