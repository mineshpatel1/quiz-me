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
    var code, i, len;
  
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (
          !(code > 47 && code < 58)  && // numeric (0-9)
          !(code > 64 && code < 91)  && // upper alpha (A-Z)
          !(code > 96 && code < 123) && // lower alpha (a-z)
          !(code == 32)                 // space
      ) { 
        return false;
      }
    }
    return true;
  };
}

export default validators;
