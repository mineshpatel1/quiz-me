import { Animated, Easing } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import Activate from '../screens/Activate';
import Friends from '../screens/Friends';
import Game from '../screens/Game';
import GameSettings from '../screens/GameSettings';
import GameSummary from '../screens/GameSummary';
import Home from '../screens/Home';
import NewGame from '../screens/NewGame';
import Questions from '../screens/Questions';
import Register from '../screens/Register';
import ResetPassword from '../screens/ResetPassword';
import Settings from '../screens/Settings';
import SignIn from '../screens/SignIn';
import UserSettings from '../screens/UserSettings';

import { animationDuration } from '../config';

const slideFromRight = () => {
  return {
    transitionSpec: {
      duration: animationDuration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const { position, layout, scene, index, scenes } = sceneProps;
      const lastSceneIndex = scenes[scenes.length - 1].index;
      const thisSceneIndex = scene.index;
      const width = layout.initWidth;

      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
        outputRange: [width, 0, 0]
      });

      let translateXMulti;
      if (!isNaN(thisSceneIndex)) {
        translateXMulti = position.interpolate({
          inputRange: [0, thisSceneIndex, thisSceneIndex + 1],
          outputRange: [width, 0, 0],
        });
      }

      if (lastSceneIndex - index > 1) {
        if (scene.index === index) return;
        if (scene.index !== lastSceneIndex) return { opacity: 0 };
        return { transform: [{ translateX: translateXMulti }] };
      }
      return { transform: [{ translateX }] };
    }
  }
}

const AppNavigator = createStackNavigator({
  Activate: { screen: Activate },
  Friends: { screen: Friends },
  Game: { screen: Game },
  GameSettings: { screen: GameSettings },
  GameSummary: { screen: GameSummary },
  Home: { screen: Home },
  NewGame: { screen: NewGame },
  Questions: { screen: Questions },
  Register: { screen: Register },
  ResetPassword: { screen: ResetPassword },
  Settings: { screen: Settings },
  SignIn: { screen: SignIn },
  UserSettings: { screen: UserSettings },
},
{
  initialRouteName: "Home",
  transitionConfig: (nav) => slideFromRight(nav),
  defaultNavigationOptions: {
    header: null,
  },
});

export default AppNavigator;
