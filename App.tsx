import 'react-native-gesture-handler'; 
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
        {}
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
