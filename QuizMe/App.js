import React, {Component} from 'react';
import { Animated, View } from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAnkh, faArrowLeft, faAtom, faBook, faBookOpen, faBrain, faCaretDown, faChartPie,
  faCheck, faChevronLeft, faChevronRight, faClock, faCog, faFilm, faFutbol,
  faGlobeAmericas, faHome, faHourglassHalf, faLandmark, faMusic, faPaw, faPlay,
  faQuestion, faQuoteRight, faTh, faTimes, faTv, faUser,
} from '@fortawesome/free-solid-svg-icons';

import AppNavigator from './src/nav/AppNavigator';
import NavigationService from './src/nav/NavigationService';
import reducers from './src/reducers/index';
import { Text } from './src/components/Core';
import { styles, colours } from './src/styles';
import { utils } from './src/utils';
import { initSettings } from './src/actions/SettingActions';

const AppContainer = createAppContainer(AppNavigator);
const store = createStore(reducers);
library.add(
  faAnkh, faArrowLeft, faAtom, faBook, faBookOpen, faBrain, faCaretDown, faChartPie,
  faCheck, faChevronLeft, faChevronRight, faClock, faCog, faFilm, faFutbol,
  faGlobeAmericas, faHome, faHourglassHalf, faLandmark, faMusic, faPaw, faPlay,
  faQuestion, faQuoteRight, faTh, faTimes, faTv, faUser,
);

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
      opacity: new Animated.Value(1),
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
    utils.animate(this.state.opacity, 0, null, () => {
      this.setState({ isReady: true });
    });
  }

  render() {
    let { state } = this;

    if (!state.isReady) {
      return (
        <View style={[styles.f1, styles.center, { backgroundColor: colours.primary }]}>
          <Animated.View style={{opacity: state.opacity}}>
            <Text bold={true} size={24} colour={colours.white}>Reticulating Splines...</Text>
          </Animated.View>
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
