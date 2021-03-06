import React, {Component} from 'react';
import { Animated, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAddressBook, faAnkh, faArrowLeft, faAtom, faBook, faBookOpen, faBrain, faCar, faCaretDown, 
  faChartPie, faCheck, faChevronLeft, faChevronRight, faClock, faCog, faEnvelope, faFilm, 
  faFingerprint, faFutbol, faGlobeAmericas, faHome, faHashtag, faHourglassHalf, faLandmark, 
  faLink, faLock, faMonument, faMusic,  faPalette, faPaw, faPlay, faRedo, faQuestion, faQuoteRight, 
  faSignInAlt, faSignOutAlt, faSyncAlt, faTh, faTimes, faTv, faUser, faUserFriends, faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

import AppNavigator from './src/nav/AppNavigator';
import NavigationService from './src/nav/NavigationService';
import reducers from './src/reducers/index';
import { styles, colours } from './src/styles';
import { utils } from './src/utils';
import { initGameSettings, initUserSettings } from './src/actions/SettingActions';

library.add(
  faAddressBook, faAnkh, faArrowLeft, faAtom, faBook, faBookOpen, faBrain, faCar, faCaretDown, 
  faChartPie, faCheck, faChevronLeft, faChevronRight, faClock, faCog, faEnvelope, faFilm, 
  faFingerprint, faFutbol, faGlobeAmericas, faGoogle, faHome, faHashtag, faHourglassHalf, faLandmark, 
  faLink, faLock, faMonument, faMusic,  faPalette, faPaw, faPlay, faRedo, faQuestion, faQuoteRight, 
  faSignInAlt, faSignOutAlt, faSyncAlt, faTh, faTimes, faTv, faUser, faUserFriends, faUserPlus,
);

const AppContainer = createAppContainer(AppNavigator);
const store = createStore(reducers, applyMiddleware(thunk));

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

  async componentDidMount() {
    SplashScreen.hide();
    await this.retrieveItem('gameSettings', initGameSettings);
    await this.retrieveItem('userSettings', initUserSettings);
    utils.animate(this.state.opacity, 0, null, () => {
      this.setState({ isReady: true });
    });
  }

  render() {
    let { state } = this;

    if (!state.isReady) {
      return (
        <View style={[styles.f1, styles.center, { backgroundColor: colours.primary }]}>
          <Animated.View style={{opacity: 1}} />
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
