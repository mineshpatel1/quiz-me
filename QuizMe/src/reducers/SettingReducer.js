import { INIT_SETTINGS, SAVE_SETTINGS } from '../types';
import { defaultSettings } from '../config';
import { utils } from '../utils';

const INITIAL_STATE = {
  settings: {},
};

const settingsReducer = (state = INITIAL_STATE, action) => {
  let _settings = {};
  switch (action.type) {
    case INIT_SETTINGS:
      for (param in defaultSettings) {
        _settings[param] = defaultSettings[param].default;
      }
      if (action.settings) {
        for (param in action.settings) {
          _settings[param] = action.settings[param];
        }
      }
      return { settings: _settings };
    case SAVE_SETTINGS:
      for (param in defaultSettings) {
        if (action.settings.hasOwnProperty(param)) {
          _settings[param] = utils.parseValue(action.settings[param], defaultSettings[param].type);
        } else {
          _settings[param] = defaultSettings[param];
        }
      }
      utils.persistStore('settings', _settings);
      console.log(action.settings);
      return { settings: action.settings };
    default:
      return state;
  }
};

export default settingsReducer;
