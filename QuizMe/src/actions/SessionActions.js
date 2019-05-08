import { SET_USER } from '../types';
import { api } from '../utils';

export const setUser = user => ({
  type: SET_USER,
  user: user,
});

export const checkSession = () => {
  return function(dispatch) {
    api.checkSession()
        .then(user => dispatch(setUser(user)))
        .catch(_err => {
          dispatch(setUser(null));
        });
  }
}

export const signOut = () => {
  return function(dispatch) {
    api.signOut()
      .then(() => dispatch(setUser(null)))
      .catch(err => {
        console.error(err);
        dispatch(setUser(null))
      });
  }
}

export const deleteAccount = () => {
  return function(dispatch) {
    api.deleteUser()
      .then(() => dispatch(setUser(null)))
      .catch(err => console.error(err))
  }
}