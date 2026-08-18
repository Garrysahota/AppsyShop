/**
 * @format
 * Entry point — gesture handler is imported first inside App.tsx
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
