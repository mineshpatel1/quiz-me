import { NEW_GAME } from '../types';

export const newGame = settings => ({
  type: NEW_GAME,
  settings: settings,
});
