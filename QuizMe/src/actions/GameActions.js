import { NEW_GAME, NEXT_TURN, INCREMENT_SCORE } from '../types';

export const newGame = settings => ({
  type: NEW_GAME,
  settings: settings,
});

export const nextTurn = () => ({
  type: NEXT_TURN,
});

export const increment = () => ({
  type: INCREMENT_SCORE,
})
