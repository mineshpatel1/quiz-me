import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft, faCog } from '@fortawesome/free-solid-svg-icons';

import AppNavigator from './src/nav/AppNavigator';
import NavigationService from './src/nav/NavigationService';
import reducers from './src/reducers/index';

const AppContainer = createAppContainer(AppNavigator);
const store = createStore(reducers);
library.add(faArrowLeft, faCog);

export default class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <AppContainer ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}/>
      </Provider>
    );
  }
}
