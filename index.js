/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'reflect-metadata';
import('react-native-get-random-values-windows')


LogBox.ignoreAllLogs(true);

AppRegistry.registerComponent(appName, () => App);
