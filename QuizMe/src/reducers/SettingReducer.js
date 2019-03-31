import { INIT_SETTINGS } from '../types';

const INITIAL_STATE = {};

const settingsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_SETTINGS:
      return state;
    default:
      return state;
  }
};

export default settingsReducer;
