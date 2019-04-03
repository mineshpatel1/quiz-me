import { INIT_SETTINGS, SAVE_SETTINGS } from '../types';

export const initSettings = settings => ({
  type: INIT_SETTINGS,
  settings: settings,
});

export const saveSettings = settings => ({
  type: SAVE_SETTINGS,
  settings: settings,
})
