import { SET_USER } from '../types';

const INITIAL_STATE = {
  user: null,
};

const sessionReducer = (state = INITIAL_STATE, action) => {
  let _user;
  switch (action.type) {
    case SET_USER:
      _user = action.user === undefined ? state.user : action.user;
      return { user: _user };
    default:
      return state;
  }
}

export default sessionReducer;