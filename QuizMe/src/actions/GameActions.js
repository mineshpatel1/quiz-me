import { NEW_GAME, NEXT_TURN, CHOOSE_ANSWER } from '../types';

export const newGame = (settings, player1, player2) => ({
  type: NEW_GAME,
  settings: settings,
  player1: player1,
  player2: player2,
});

export const nextTurn = () => ({
  type: NEXT_TURN,
});

export const chooseAnswer = chosen => ({
  type: CHOOSE_ANSWER,
  chosen: chosen,
});
