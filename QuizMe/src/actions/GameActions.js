import { NEW_GAME, NEXT_TURN, CHOOSE_ANSWER } from '../types';

export const newGame = settings => ({
  type: NEW_GAME,
  settings: settings,
});

export const nextTurn = () => ({
  type: NEXT_TURN,
});

export const chooseAnswer = chosen => ({
  type: CHOOSE_ANSWER,
  chosen: chosen,
});
