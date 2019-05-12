import { INIT_GAME_SETTINGS, SAVE_GAME_SETTINGS } from '../types';

export const initGameSettings = settings => ({
  type: INIT_GAME_SETTINGS,
  settings: settings,
});

export const saveGameSettings = settings => ({
  type: SAVE_GAME_SETTINGS,
  settings: settings,
});