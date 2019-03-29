import { INIT_SETTINGS } from '../types';

const INITIAL_SETTINGS = {};

const settingsReducer = (state = INITIAL_SETTINGS, action) => {
  switch (action.type) {
    case INIT_SETTINGS:
      return state;
    default:
      return state;
  }
};

export default settingsReducer;
