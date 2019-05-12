import { 
  INIT_GAME_SETTINGS, SAVE_GAME_SETTINGS, 
  INIT_USER_SETTINGS, SAVE_USER_SETTINGS,
} from '../types';
import { defaultSettings } from '../config';
import { utils } from '../utils';

const INITIAL_STATE = {
  game: {},
  user: {},
};

const settingsReducer = (state = INITIAL_STATE, action) => {
  let _gameSettings = {};
  let _userSettings = {};

  switch (action.type) {
    case INIT_GAME_SETTINGS:
      for (param in defaultSettings) {
        _gameSettings[param] = defaultSettings[param].default;
      }
      if (action.settings) {
        for (param in action.settings) {
          _gameSettings[param] = action.settings[param];
        }
      }
      return { game: _gameSettings, user: state.user };

    case SAVE_GAME_SETTINGS:
      for (param in defaultSettings) {
        if (action.settings.hasOwnProperty(param)) {
          _gameSettings[param] = utils.parseValue(action.settings[param], defaultSettings[param].type);
        } else {
          _gameSettings[param] = defaultSettings[param];
        }
      }
      utils.persistStore('gameSettings', _gameSettings);
      return { game: action.settings, user: state.user };

    case INIT_USER_SETTINGS:
      _userSettings = utils.update(state.user, action.settings);
      return { game: state.game, user: _userSettings };

    case SAVE_USER_SETTINGS:
      _userSettings = utils.update(state.user, action.settings);
      utils.persistStore('userSettings', _userSettings);
      return { game: state.game, user: _userSettings };

    default:
      return state;
  }
};

export default settingsReducer;
