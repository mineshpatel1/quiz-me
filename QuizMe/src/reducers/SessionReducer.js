import { SET_SESSION } from '../types';

const INITIAL_STATE = {
  user: null,
  unconfirmed: null,
};

const sessionReducer = (state = INITIAL_STATE, action) => {
  let _user, _unconfirmed;
  switch (action.type) {
    case SET_SESSION:
      _user = action.user === undefined ? state.user : action.user;
      _unconfirmed = action.unconfirmed === undefined ? state.unconfirmed : action.unconfirmed;
      return { user: _user, unconfirmed: _unconfirmed };
    default:
      return state;
  }
}

export default sessionReducer;