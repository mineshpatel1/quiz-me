import { 
  INIT_GAME_SETTINGS, SAVE_GAME_SETTINGS, 
  INIT_USER_SETTINGS, SAVE_USER_SETTINGS,
} from '../types';

export const initGameSettings = settings => ({
  type: INIT_GAME_SETTINGS,
  settings: settings,
});

export const saveGameSettings = settings => ({
  type: SAVE_GAME_SETTINGS,
  settings: settings,
});

export const initUserSettings = settings => ({
  type: INIT_USER_SETTINGS,
  settings: settings,
});

export const saveUserSettings = settings => ({
  type: SAVE_USER_SETTINGS,
  settings: settings,
});