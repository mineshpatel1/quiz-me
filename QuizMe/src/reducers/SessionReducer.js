import { SET_SESSION, SET_CONNECTION } from '../types';
import utils from '../utils/utils';

const INITIAL_STATE = {
  user: null,
  unconfirmed: null,
  resetPassword: null,
  online: null,
  friends: null,
  requests: null,
};

const sessionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_SESSION:
      return utils.update(state, action);
    case SET_CONNECTION:
      return utils.update(state, { online: action.online });
    default:
      return state;
  }
}

export default sessionReducer;