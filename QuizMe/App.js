import React, {Component} from 'react';
import { AsyncStorage, StyleSheet, View } from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowLeft, faCog, faCheck, faTimes,
} from '@fortawesome/free-solid-svg-icons';

import AppNavigator from './src/nav/AppNavigator';
import NavigationService from './src/nav/NavigationService';
import reducers from './src/reducers/index';
import { Text } from './src/components/Core';
import { styles, colours } from './src/styles';

const AppContainer = createAppContainer(AppNavigator);
const store = createStore(reducers);
library.add(faArrowLeft, faCog, faCheck, faTimes);

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  async componentWillMount() {
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return (
        <View style={[styles.f1, styles.center, {backgroundColor: colours.primary}]}>
          <Text bold={true} size={24} color={colours.white}>Reticulating Splines...</Text>
        </View>
      );
    }

    return (
      <Provider store={ store }>
        <AppContainer ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}/>
      </Provider>
    );
  }
}
