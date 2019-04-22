const _checkChar = (str, fn) => {
  if (!str) return true;
  let code, i, len
  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (fn(code)) return true;
  }
  return false;
}

class validators {
  constructor() {}

  static required(val) {
    return !val;
  }

  /** Checks if all objects in an array are unique by a given key */
  static uniqueByKey(_array, _key) {
    let unique = new Set();
    for (let val of _array) {
      unique.add(val[_key]);
    }
    return unique.size < _array.length;
  }

  /** Validate using multiple validation functions */
  static validate(val, validators) {
    let error = false;
    for (let vFn of validators) {
      if (error) {
        break;
      }
      error = vFn(val);
    }
    return error;
  }

  static isAlphaNumeric(str) {
    if (!str) return true;

    let code, i, len;
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (
          !(code > 47 && code < 58)  &&  // numeric (0-9)
          !(code > 64 && code < 91)  &&  // upper alpha (A-Z)
          !(code > 96 && code < 123) &&  // lower alpha (a-z)
          !(code == 32)                  // space
      ) { 
        return false;
      }
    }
    return true;
  };

  static checkChar(str, fn) {
    return _checkChar(str, fn);
  }

  static hasLower(str) {
    return _checkChar(str, (code) => {
      return code > 96 && code < 123;  // lower alpha (a-z)
    });
  }

  static hasUpper(str) {
    return _checkChar(str, (code) => {
      return code > 64 && code < 91;  // upper alpha (a-z)
    });
  }

  static hasNumeric(str) {
    return _checkChar(str, (code) => {
      return code > 47 && code < 58;  // numeric (0-9)
    });
  }

  static hasSpace(str) {
    return _checkChar(str, (code) => {
      return code == 32;  // space
    });
  }

  static isEmail(str) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(str).toLowerCase());
  }
}

export default validators;
