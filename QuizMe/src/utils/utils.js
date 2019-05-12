import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { Animated, Easing } from 'react-native';

import { animationDuration } from '../config';

const _sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const _clone = (_orig) => {
  return Object.assign( Object.create( Object.getPrototypeOf(_orig)), _orig);
}

class utils {
  constructor() {}

  static now = () => {
    return Math.ceil(Date.now() / 1000);
  }

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

  /** Finds a key of an object from a given value property. */
  static getKeyFromVal = (_obj, _prop, _val) => {
    for (key in _obj) {
      if (_obj[key][_prop] == _val) return key;
    }
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
  static clone = _clone;

  /** Updates an old object with a new one, returning a completely new Object. */
  static update = (prev, next) => {
    return Object.assign({}, prev, next);
  }

  /** Sorts an array of objects by the value of a specific key. */
  static sortByKey = (_array, _key, asc=true) => {
    let new_array = [];
    let multiplier = asc ? 1 : -1;

    for (let _obj of _array) {
      new_array.push(_clone(_obj));
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
    animatedValue, newVal, duration=null, callback=null, easing=Easing.ease,
    delay=0,
  ) {
    if (!duration && duration != 0) duration = animationDuration;
    Animated.timing(
      animatedValue,
      {
        toValue: newVal,
        duration: duration,
        easing: easing,
        delay: delay,
      }
    ).start(callback);
  }

  /** Converts polar coordinates to Cartesian coordinates. */
  static polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  /** Reduces text size for long strings. Crude and empirically derived. */
  static scaleOptText(text, size) {
    if (text.length >= 100) {
      size -= 8;
    } else if (text.length >= 85) {
      size -= 7;
    } else if (text.length >= 80) {
      size -= 7;
    } else if (text.length >= 75) {
      size -= 7;
    } else if (text.length >= 70) {
      size -= 6;
    } else if (text.length >= 65) {
      size -= 5;
    } else if (text.length >= 60) {
      size -= 4;
    } else if (text.length >= 55) {
      size -= 3;
    } else if (text.length >= 50) {
      size -= 2;
    } else if (text.length >= 45) {
      size -= 1;
    }

    return size;
  }

  static scaleQText(text, size) {
    if (text.length >= 400) {
      size -= 8;
    } else if (text.length >= 350) {
      size -= 7;
    } else if (text.length >= 300) {
      size -= 6;
    } else if (text.length >= 250) {
      size -= 5;
    } else if (text.length >= 200) {
      size -= 4;
    } else if (text.length >= 180) {
      size -= 3;
    } else if (text.length >= 170) {
      size -= 2;
    } else if (text.length >= 160) {
      size -= 1;
    }
    return size;
  }

  /** Lighten or darken a colour given by a Hex value. */
  static alterBrightness(col, amt) {
    let usePound = false;
    
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
  
    let num = parseInt(col, 16);
  
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
  
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
  
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    if (r == 0 && b == 0 && g == 0) return '#000000';
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  }

  static isDark(color) {
    // Variables for red, green, blue values
    var r, g, b, hsp;
      
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
        // If HEX --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        
        r = color[1];
        g = color[2];
        b = color[3];
    } 
    else {
        // If RGB --> Convert it to HEX: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) return false;
    else return true;
  }

  /** Gets network connectivity info from the phone. */
  static async getConnectionInfo() {
    let connectionInfo = await NetInfo.getConnectionInfo();
    return connectionInfo;
  }
}

export default utils;
