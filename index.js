/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'reflect-metadata';
// eslint-disable-next-line no-undef
if (Platform.OS === 'windows') {
  import('react-native-get-random-values-windows')
    .then(module => {
      module.default();
      startApp();
    })
    .catch(error => {
      startApp();
    });
} else {
  import('react-native-get-random-values')
    .then(module => {
      module.default();
      startApp();
    })
    .catch(error => {
      startApp();
    });
}

LogBox.ignoreAllLogs(true);

function startApp() {
  AppRegistry.registerComponent(appName, () => App);
}
