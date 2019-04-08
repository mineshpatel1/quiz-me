import AsyncStorage from '@react-native-community/async-storage';
import { Animated, Easing } from 'react-native';

import { animationDuration } from '../config';

const _sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const clone = (_orig) => {
  return Object.assign( Object.create( Object.getPrototypeOf(_orig)), _orig);
}

class utils {
  constructor() {}

  /**
  Gets the index of an object array based on the value of a given key
  */
  static indexOfArray = (_array, _key, val) => {
    return _array.map((x) => x[_key]).indexOf(val);
  }

  /**
  Shuffles an array, randomising the order of elements in an array using
  the Fisher-Yates method.
  */
  static shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  /**
  Checks a list of objects to see if it has a matching value based
  on a given key.
  **/
  static matchByKey = (_array, _key, _instance, fetch=false) => {
    for (var _obj of _array) {
      if (typeof(_instance) == 'string') {
        if (_obj[_key] == _instance) {
          if (fetch) {
            return _obj;
          } else {
            return true;
          }
        }
      } else {
        if (_obj[_key] == _instance[_key]) {
          if (fetch) {
            return _obj;
          } else {
            return true;
          }
        }
      }
    }
    return false;
  }

  /** Finds the numeric index of an object within an array. */
  static containsObj = (_obj, _array) => {
    for (let i = 0; i < _array.length; i++) {
        if (_array[i] === _obj) {
            return i;
        }
    }
  }

  /** Sets object properties based on default values. */
  static setFromDefault = (_obj, defaultValues) => {
    for (prop in defaultValues) {
      if (!_obj.hasOwnProperty(prop)) {
        _obj[prop] = defaultValues[prop];
      }
    }
    return _obj;
  }

  /** Saves a JSON object to AsyncStorage. */
  static persistStore = (key, payload) => {
    AsyncStorage.setItem(key, JSON.stringify(payload));
  }

  /** Returns element of an array with the largest value of a given key. */
  static maxBy = (_array, _key) => {
    return _array.reduce((prev, current) => {
      return (prev[_key] > current[_key]) ? prev : current;
    });
  }

  /** Returns element of an array with the largest value of a given key. */
  static minBy = (_array, _key) => {
    return _array.reduce((prev, current) => {
      return (prev[_key] < current[_key]) ? prev : current;
    });
  }

  /** Clones an instance of a class. */
  static clone = clone;

  /** Sorts an array of objects by the value of a specific key. */
  static sortByKey = (_array, _key, asc=true) => {
    let new_array = [];
    let multiplier = asc ? 1 : -1;

    for (let _obj of _array) {
      new_array.push(clone(_obj));
    }

    return new_array.sort(function(a, b){
      if (a[_key] < b[_key]) return multiplier * -1;
      if (a[_key] > b[_key]) return multiplier * 1;
      if (a[_key] == b[_key]) return 0;
    });
  }

  /**
  Formats an integer value of seconds into minutes and seconds with seconds
  zero-padded.
  */
  static formatSeconds = (ms) => {
    let s = ms;
    let mins = Math.floor(s / 60).toString();
    let secs = (s - (mins * 60)).toString();

    if (parseInt(secs) < 10) {
      secs = '0' + secs;
    }

    return mins + ':' + secs;
  }

  /**
  Converts a Hex colour to rgba string
  */
  static hexToRgba = (hex, a=1) => {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result) {
        let r = parseInt(result[1], 16).toString();
        let g = parseInt(result[2], 16).toString();
        let b = parseInt(result[3], 16).toString();
        return 'rgba(' + r +', ' + g + ', ' + b + ', ' + a.toString() + ')';
      }
  }

  /** Returns an array of incremented integers of length n. */
  static sequence = (n) => {
    return Array.apply(null, {length: n}).map(Function.call, Number);
  }

  /** Parses a value given an expected type. E.g. Turns a string to a number or vice versa. */
  static parseValue = (val, type) => {
    switch(type) {
      case 'string':
        return val.toString();
      case 'int':
        val = parseInt(val);
        if (isNaN(val)) val = null;
        return val;
      case 'number':
        val = Number(val);
        if (isNaN(val)) val = null;
        return val;
    }
  }

  /** Async function, sleeps for the given time in ms. */
  static async sleep(ms, callback) {
    await _sleep(ms);
    callback();
  }

  /** Generic animation function. */
  static animate(
    animatedValue, newVal, duration=animationDuration, callback=null, easing=Easing.ease,
  ) {
    Animated.timing(
      animatedValue,
      {
        toValue: newVal,
        duration: duration,
        easing: easing,
      }
    ).start(callback);
  }
}

export default utils;
