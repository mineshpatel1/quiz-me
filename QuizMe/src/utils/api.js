import { server } from '../config';
import utils from './utils';

const UNEXPECTED_ERROR_MSG = "Unexpected error occurred.";

const _serverUrl = (path) => {
  let http = server.secure ? 'https' : 'http';
  return http + '://' + server.host + ':' + server.port + '/' + path;
}

/** Standard GET method for contacting the server. */
const _get = async (path) => {
  let url = _serverUrl(path);

  return fetch(url, { method: 'GET', credentials: 'include' })
    .then(res => {
      if (!res.ok) throw "Server Error: " + res.status.toString();
      return res.json();
    });
}

/** Standard POST method for contacting the server. */
const _post = async (path, data) => {
  let url = _serverUrl(path);

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(res => {
    if (!res.ok) throw "Server Error: " + res.status.toString();
    return res.json();
  })
  .then(res => {
    if (res.error) throw res.error;
    if (!res.ok) throw UNEXPECTED_ERROR_MSG;
    return res;
  });
}

/** Standard POST method for contacting the server. */
const _delete = async (path) => {
  let url = _serverUrl(path);

  return fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  }).then(res => {
    if (!res.ok) throw "Server Error: " + res.status.toString();
    return res.json();
  });
}

class api {
  constructor() {}

  static async get(path) { return _get(path) }
  static async post(path, data) { return _post(path, data) }
  static async delete(path) { return _delete(path) }

  /** Checks if a user already has an active session. */
  static async checkSession(withData=true) {
    if (withData) return _get('session/load');
    else return _get('session');
  }

  /** Signs in a user. */
  static async signIn(data) {
    return _post('session/login', data);
  }

  /** Signs out of a QuizMe session. */
  static async signOut() {
    return _get('session/logout');
  }

  static async verifyFingerprint(payload, signature, pushToken) {
    return _post('session/login/fingerprint', { payload, signature, pushToken });
  }

  /** Creates a new QuizMe user. */
  static async register(data) {
    return _post('user/register', data);
  }

  static async editUser(data) {
    return _post('user', data);
  }

  /** Deletes the currently active user's account. */
  static async deleteUser() {
    return _delete('user');
  }

  /** Activates a user account. */
  static async activate(email, token, pushToken) {
    return _post('user/activate', { email, token, pushToken });
  }

  /** Reset the activation token for the user and prompt an email. */
  static async resetToken(email) {
    return _post('user/resetToken', { email });
  }

  /** Adds a push token for a given user. */
  static async addPushToken(user) {
    return new Promise((resolve, reject) => {
      utils.getPushToken()
        .then(pushToken => {
          if (user.push_tokens.indexOf(pushToken) == -1) {
            _post('user/pushToken', { pushToken })
              .then(resolve)
              .catch(reject);
          }
        })
        .catch(reject);
    });
  }

  /** Sends a password reset token to the user. */
  static async forgottenPassword(email) {
    return _post('user/forgottenPassword', { email });
  }

  /** Resets a user's password. */
  static async resetPassword(email, token, password) {
    return _post('user/resetPassword', { email, token, password });
  }

  /** Changes a user's password. */
  static async changePassword(currentPassword, newPassword) {
    return _post('user/changePassword', { currentPassword, newPassword });
  }

  static async setPassword(password) {
    return _post('user/setPassword', { password });
  }

  static async enableFingerprint(publicKey) {
    return _post('user/enableFingerprint', { publicKey });
  }

  static async disableFingerprint(publicKey) {
    return _post('user/disableFingerprint', { publicKey });
  }

  static async getFriends() {
    return _get('friends');
  }

  static async getFriendRequestCount() {
    return _get('friends/requestCount');
  }

  static async friendRequests(emails) {
    return _post('friends/requests', { emails });
  }

  static async confirmFriend(friendId) {
    return _post('friends/confirm', { friendId });
  }

  static async unfriend(friendId) {
    return _post('friends/unfriend', { friendId });
  }

  static async getPossibleFriends(emails) {
    return _post('friends/possible', { emails });
  }

  static async gameRequest(settings, opponent) {
    return _post('game/request', { settings, opponent });
  }

  static async verifyGoogleToken(user, token, pushToken) {
    return _post('session/login/google', { user, token, pushToken });
  }
}

export default api;