import { defaultTeams } from './config';

export class Game {
  constructor(settings, scores=null, turn=null, turns=null) {
    this.settings = settings;
    this.scores = 0;
    this.turn = 0;
  }

  nextTurn(team) {
    this.turn += 1;
  }
}
