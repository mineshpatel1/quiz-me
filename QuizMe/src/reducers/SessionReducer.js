import { SET_STATUS, CHECK_SESSION } from '../types';
import { utils, api } from '../utils';

const INITIAL_STATE = {
  active: false,
};

const sessionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_STATUS:
      return { active: action.status };
    default:
      return state;
  }
}

export default sessionReducer;