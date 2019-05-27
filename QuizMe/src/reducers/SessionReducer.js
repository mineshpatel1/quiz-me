import { SET_SESSION, SET_CONNECTION, SET_REQUEST_COUNT } from '../types';
import utils from '../utils/utils';

const INITIAL_STATE = {
  user: null,
  unconfirmed: null,
  resetPassword: null,
  online: null,
  requestCount: null,
};

const sessionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_SESSION:
      return utils.update(state, action);
    case SET_CONNECTION:
      return utils.update(state, { online: action.online });
    case SET_REQUEST_COUNT:
      return utils.update(state, { requestCount: action.count });
    default:
      return state;
  }
}

export default sessionReducer;