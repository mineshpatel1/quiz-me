import { SET_SESSION } from '../types';
import utils from '../utils/utils';

const INITIAL_STATE = {
  user: null,
  unconfirmed: null,
  resetPassword: null,
};

const sessionReducer = (state = INITIAL_STATE, action) => {
  let _session;
  switch (action.type) {
    case SET_SESSION:
      _session = {};
      Object.keys(state).forEach(prop => {
        _session[prop] = action[prop] === undefined ? state[prop] : action[prop];
      });
      return _session;
    default:
      return state;
  }
}

export default sessionReducer;