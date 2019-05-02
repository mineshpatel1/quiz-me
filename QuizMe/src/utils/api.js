import utils from './utils';

const UNEXPECTED_ERROR_MSG = "Unexpected error occurred.";

class api {
  constructor() {}

  /** Checks if a user already has an active session. */
  static async checkSession() {
    return utils.get('session')
      .then(res => {
        if (!res.user) return null;
        else return res.user;
      });
  }

  /** Signs out of a QuizMe session. */
  static async signOut() {
    return utils.get('session/logout');
  }

  /** Creates a new QuizMe user. */
  static async newUser(data) {
    return utils.post('user/new', data)
        .then(res => {
          if (res.error) throw res.error;
          if (!res.success) throw UNEXPECTED_ERROR_MSG;
          return res;
        });
  }
}

export default api;