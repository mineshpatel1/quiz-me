import { CHECK_SESSION, SET_STATUS } from '../types';
import { api } from '../utils';

export const setStatus = status => ({
  type: SET_STATUS,
  status: status,
});

export const checkSession = () => {
  return function(dispatch) {
    api.checkSession()
        .then(status => { 
          console.log('CheckSession', status);
          dispatch(setStatus(status));
        })
        .catch(err => {
          console.error(err);
          dispatch(setStatus(false));
        });
  }
}