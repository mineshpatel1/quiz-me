import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { createAppContainer } from 'react-navigation';

import AppNavigator from './src/AppNavigator';
import reducers from './src/reducers/index';

const AppContainer = createAppContainer(AppNavigator);
const store = createStore(reducers);

export default class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <AppContainer/>
      </Provider>
    );
  }
}
