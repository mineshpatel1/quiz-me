import { defaultTeams } from './config';
import { utils } from './utils';

export class Game {
  constructor(settings, player1=null, player2=null) {
    this.settings = settings;
    this.score = 0;
    this.turn = 0;
    this.questions = [];
    this.player1 = player1;
    this.player2 = player2;
  }

  increment() {
    this.score += 1;
  }

  nextTurn() {
    this.turn += 1;
  }

  saveQuestion(question, chosen) {
    question.chosen = chosen;
    this.questions.push(question);
  }

  lastTurn() {
    return (this.turn + 1) == this.settings.numQuestions;
  }

  isOver() {
    return (this.turn + 1) > this.settings.numQuestions;
  }
}

export class Question {
  constructor(qData) {
    this.id = qData.id;
    this.question = qData.question;
    this.options = qData.options;
    this.answer = qData.answer;
    this.category_id = qData.category_id;

    this.shuffle();  // Randomise option order
  }

  shuffle() {
    this.options = utils.shuffle(this.options);
  }
}
