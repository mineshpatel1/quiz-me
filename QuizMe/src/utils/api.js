import { server } from '../config';

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

  /** Checks if a user already has an active session. */
  static async checkSession() {
    return _get('session')
      .then(res => {
        if (!res.user) return null;
        else return res.user;
      });
  }

  /** Signs in a user. */
  static async signIn(data) {
    return _post('user/auth', data);
  }

  /** Signs out of a QuizMe session. */
  static async signOut() {
    return _get('session/logout');
  }

  /** Creates a new QuizMe user. */
  static async newUser(data) {
    return _post('user/new', data);
  }

  /** Deletes the currently active user's account. */
  static async deleteUser() {
    return _delete('user');
  }
}

export default api;