import { Animated, Easing } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import Activate from '../screens/Activate';
import AddFriend from '../screens/AddFriend';
import EditProfile from '../screens/EditProfile';
import Friends from '../screens/Friends';
import GameSettings from '../screens/GameSettings';
import GameSummary from '../screens/GameSummary';
import Home from '../screens/Home';
import MultiGame from '../screens/MultiGame';
import NewGame from '../screens/NewGame';
import Questions from '../screens/Questions';
import Register from '../screens/Register';
import ResetPassword from '../screens/ResetPassword';
import Settings from '../screens/Settings';
import SignIn from '../screens/SignIn';
import SingleGame from '../screens/SingleGame';
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
  AddFriend: { screen: AddFriend },
  Activate: { screen: Activate },
  EditProfile: { screen: EditProfile },
  Friends: { screen: Friends },
  GameSettings: { screen: GameSettings },
  GameSummary: { screen: GameSummary },
  Home: { screen: Home },
  MultiGame: { screen: MultiGame },
  NewGame: { screen: NewGame },
  Questions: { screen: Questions },
  Register: { screen: Register },
  ResetPassword: { screen: ResetPassword },
  Settings: { screen: Settings },
  SignIn: { screen: SignIn },
  SingleGame: { screen: SingleGame },
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
