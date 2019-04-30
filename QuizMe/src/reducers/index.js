import { combineReducers } from 'redux';
import GameReducer from './GameReducer';
import SettingReducer from './SettingReducer';
import SessionReducer from './SessionReducer';

export default combineReducers({
  game: GameReducer,
  settings: SettingReducer,
  session: SessionReducer,
})
