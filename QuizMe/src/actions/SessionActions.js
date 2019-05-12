import { SET_SESSION } from '../types';
import { api } from '../utils';

export const setSession = session => ({
  type: SET_SESSION,
  user: session && session.user,
  unconfirmed: session && session.unconfirmed,
  resetPassword: session && session.resetPassword,
});

export const checkSession = () => {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      api.checkSession()
        .then(session => {
          dispatch(setSession(session));
          return resolve(session);
        })
        .catch(_err => {
          dispatch(setSession(null));
          return reject(_err);
        });
    });
  }
}

export const signOut = () => {
  return function(dispatch) {
    api.signOut()
      .then(() => dispatch(setSession(null)))
      .catch(err => {
        console.error(err);
        dispatch(setSession(null))
      });
  }
}

export const deleteAccount = () => {
  return function(dispatch) {
    api.deleteUser()
      .then(() => dispatch(setSession(null)))
      .catch(err => console.error(err))
  }
}