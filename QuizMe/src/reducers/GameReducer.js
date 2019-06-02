import { NEW_GAME, NEXT_TURN, CHOOSE_ANSWER } from '../types';
import { Game, Question } from '../objects';
import { utils } from '../utils';
import { categories } from '../config';

const questionLib = require('../../assets/data/questions.json');

const getQuestion = (previous, question, category='General Knowledge') => {
  let questions = questionLib.questions;
  if (question) previous.add(question.id);

  var i = 0;
  question = null;
  while (!question && i < questions.length) {
    let randomQ = questions[Math.round(Math.random() * questions.length)];
    if (randomQ && randomQ.hasOwnProperty('id')) {
      let category_id = utils.getKeyFromVal(categories, 'name', category);
      if (randomQ.category_id == category_id) {
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
      _newQ = getQuestion(previous, question, action.settings.category);
      _newGame = new Game(action.settings, action.opponent);
      return { currentGame: _newGame, question: _newQ.question, previous: _newQ.previous };
    case NEXT_TURN:
      currentGame.nextTurn();
      _newQ = getQuestion(previous, question, currentGame.settings.category);
      _newGame = utils.clone(currentGame);
      return { currentGame: _newGame, question: _newQ.question, previous: _newQ.previous };
    case CHOOSE_ANSWER:
      if (action.chosen == question.answer) currentGame.increment();
      currentGame.saveQuestion(question, action.chosen);
      _newGame = utils.clone(currentGame);
      return { currentGame: _newGame, question: question, previous: previous }
    default:
      return state;
  }
}

export default gameReducer;
