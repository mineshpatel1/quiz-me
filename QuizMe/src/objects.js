import { defaultTeams } from './config';

export class Game {
  constructor(settings, scores=null, turn=null, turns=null) {
    this.settings = settings;
    this.teams = [];
    this.scores = {};
    this.turn = 0;
    this.turns = {};

    for (let i = 0; i < 2; i++) {
      this.teams.push(defaultTeams[i]);
    }

    this.resetScores();
  }

  resetTurns() {
    this.turns = {}
    for (let team of this.teams) {
      this.turns[team.name] = 0;
      team.turns = 0;
    }
  }

  resetScores() {
    this.scores = {};
    for (let team of this.teams) {
      this.scores[team.name] = {};
      team.score = 0;
    }
  }

  increment(team) {
    team.score += 1;
    this.scores[team.name] += 1;
  }

  decrement(team) {
    team.score -= 1;
    this.scores[team.name] -= 1;
  }

  nextTurn(team) {
    this.turn += 1;
    this.turns[team.name] += 1;
    team.turns += 1;
  }

  currentIndex() {
    return this.turn % this.teams.length;
  }

  currentTeam() {
    return this.teams[this.currentIndex()];
  }

  round() {
    return Math.floor(this.turn / this.teams.length) + 1;
  }

  gameOver() {
    return (this.round() > this.settings.numTurns) || (this.settings.numTurns * this.teams.length == this.turn);
  }

  winner() {
    return utils.maxBy(this.teams, 'score');
  }
}
