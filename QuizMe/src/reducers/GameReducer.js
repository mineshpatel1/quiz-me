import { NEW_GAME } from '../types';
import { Game, Question } from '../objects';

const questionLib = require('../../assets/data/questions.json');

const getQuestion = (previous, question) => {
  let questions = questionLib.questions;
  if (question) previous.add(question.id);

  var i = 0;
  question = null;
  while (!question && i < questions.length) {
    let randomQ = questions[Math.round(Math.random() * questions.length)];
    if (!previous.has(randomQ.id)) question = randomQ;
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
  let _newQState;
  let _newGame;

  switch (action.type) {
    case NEW_GAME:
      _newQState = getQuestion(previous, question);
      _newGame = new Game(action.settings);
      return { currentGame: _newGame, question: _newQState.question, previous: _newQState.previous };
    default:
      return state;
  }
}

export default gameReducer;
