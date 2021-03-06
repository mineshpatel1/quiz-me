import { SET_SESSION, SET_CONNECTION } from '../types';
import { api } from '../utils';

export const setSession = session => ({
  type: SET_SESSION,
  user: session && session.user,
  unconfirmed: session && session.unconfirmed,
  resetPassword: session && session.resetPassword,
  friends: session && session.friends,
  requests: session && session.requests,
  googleId: session && session.googleId,
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
    return new Promise((resolve, reject) => {
      api.signOut()
        .then(() => {
          dispatch(setSession(null));
          return resolve();
        })
        .catch(err => {
          dispatch(setSession(null))
          reject(err);
        });
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