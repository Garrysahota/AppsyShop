import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'appsy-shop-v1',
});

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
