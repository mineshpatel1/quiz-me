import React, {Component} from 'react';
import { StyleSheet, View } from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowLeft, faCog, faCheck, faTimes, faQuestion, faClock, faPlay, faHome,
  faHourglassHalf,
} from '@fortawesome/free-solid-svg-icons';

import AppNavigator from './src/nav/AppNavigator';
import NavigationService from './src/nav/NavigationService';
import reducers from './src/reducers/index';
import { Text } from './src/components/Core';
import { styles, colours } from './src/styles';
import { initSettings } from './src/actions/SettingActions';

const AppContainer = createAppContainer(AppNavigator);
const store = createStore(reducers);
library.add(
  faArrowLeft, faCog, faCheck, faTimes, faQuestion, faClock, faPlay, faHome,
  faHourglassHalf,
);

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  // Retrieves an object in local storage, optionally initialises with an action
  async retrieveItem(key, _init = null) {
    try {
      const result = await AsyncStorage.getItem(key);
      if (_init) store.dispatch(_init(JSON.parse(result)));
      return result;
    } catch(e) {
      if (_init) store.dispatch(_init(null));
      return null;
    }
  }

  async componentWillMount() {
    await this.retrieveItem('settings', initSettings);
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
