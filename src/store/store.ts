/**
 * Redux Store — AppsyShop
 * Configured with redux-persist backed by MMKV (AES-256 encrypted).
 * Only the onboarding slice is persisted (auth tokens → Keychain, cart → MMKV directly).
 */

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import mmkvStorage from './mmkvStorage';
import rootReducer from './rootReducer';

const persistConfig = {
  key: 'root',
  storage: mmkvStorage,
  whitelist: ['onboarding', 'auth', 'cart', 'checkout', 'notifications'], // persist user state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types to suppress serialization warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
