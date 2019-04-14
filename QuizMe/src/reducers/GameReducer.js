import { NEW_GAME, NEXT_TURN, INCREMENT_SCORE } from '../types';
import { Game, Question } from '../objects';
import { utils } from '../utils';

const questionLib = require('../../assets/data/questions.json');

const getQuestion = (previous, question) => {
  let questions = questionLib.questions;
  if (question) previous.add(question.id);

  var i = 0;
  question = null;
  while (!question && i < questions.length) {
    let randomQ = questions[Math.round(Math.random() * questions.length)];
    if (randomQ.hasOwnProperty('id')) {
      if (randomQ.category_id == 1) {
        if (!previous.has(randomQ.id)) question = randomQ;
      }
    }
    i++;
  }
  question = new Question(question);
  return { question, previous };
}

const INITIAL_STATE = {
  currentGame: null,
  question: null,
  previous: new Set(),
};

const gameReducer = (state = INITIAL_STATE, action) => {
  let { currentGame, question, previous } = state;
  let _newQ;
  let _newGame;

  switch (action.type) {
    case NEW_GAME:
      _newQ = getQuestion(previous, question);
      _newGame = new Game(action.settings);
      return { currentGame: _newGame, question: _newQ.question, previous: _newQ.previous };
    case NEXT_TURN:
      currentGame.nextTurn();
      _newQ = getQuestion(previous, question);
      _newGame = utils.clone(currentGame);
      return { currentGame: _newGame, question: _newQ.question, previous: _newQ.previous }
    case INCREMENT_SCORE:
      currentGame.increment();
      _newGame = utils.clone(currentGame);
      return { currentGame: _newGame, question: question, previous: previous }
    default:
      return state;
  }
}

export default gameReducer;
