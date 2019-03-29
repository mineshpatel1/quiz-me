import { INIT_SETTINGS } from '../types';

export const initSettings = settings => ({
  type: INIT_SETTINGS,
  settings: settings,
});
