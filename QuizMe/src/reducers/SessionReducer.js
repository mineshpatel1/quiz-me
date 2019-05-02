import { SET_STATUS, CHECK_SESSION } from '../types';
import { utils, api } from '../utils';

const INITIAL_STATE = {
  active: false,
};

const sessionReducer = (state = INITIAL_STATE, action) => {
  let _status;
  switch (action.type) {
    case SET_STATUS:
      _status = action.status || state.status;
      return { active: _status };
    default:
      return state;
  }
}

export default sessionReducer;