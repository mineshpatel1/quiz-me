import { combineReducers } from 'redux';
import SettingReducer from './SettingReducer';

export default combineReducers({
  settings: SettingReducer,
})
