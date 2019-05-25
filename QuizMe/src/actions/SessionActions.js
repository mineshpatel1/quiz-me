import { SET_SESSION, SET_CONNECTION } from '../types';
import { api } from '../utils';

export const setSession = session => ({
  type: SET_SESSION,
  user: session && session.user,
  unconfirmed: session && session.unconfirmed,
  resetPassword: session && session.resetPassword,
});

export const setConnection = online => ({
  type: SET_CONNECTION,
  online: online,
})

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
    return new Promise((resolve, reject) => {
      api.deleteUser()
        .then(() => {
          dispatch(setSession(null));
          return resolve();
        })
        .catch(reject);
    });
  }
}