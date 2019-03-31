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
}

export default validators;
