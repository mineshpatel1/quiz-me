import { combineReducers } from 'redux';
import GameReducer from './GameReducer';
import SettingReducer from './SettingReducer';

export default combineReducers({
  game: GameReducer,
  settings: SettingReducer,
})
