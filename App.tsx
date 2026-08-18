/**
 * App.tsx — AppsyShop Root
 *
 * Provider order (innermost wins):
 *   SafeAreaProvider → Redux Provider → PersistGate → NavigationContainer → RootNavigator
 *
 * SafeAreaProvider wraps everything so all screens can access insets via useSafeAreaInsets().
 * Individual screens apply insets manually so gradient backgrounds bleed edge-to-edge.
 */

import 'react-native-gesture-handler'; // ← must be the very first import
import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@store/store';
import RootNavigator from '@app/navigation/RootNavigator';
import { colors } from '@theme';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <Provider store={store}>
        {/*
         * PersistGate with loading={null} — the SplashScreen serves
         * as the visual loading state while MMKV hydrates Redux.
         * Hydration via MMKV is synchronous under the hood and completes
         * well within the SplashScreen's 2.5s animation window.
         */}
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
