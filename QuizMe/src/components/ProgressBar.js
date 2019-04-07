import React, { Component } from 'react';
import { Animated, View, Easing, } from 'react-native';

import { utils } from '../utils';
import { styles, colours } from '../styles';

export default class ProgressBar extends Component {
  static defaultProps = {
    colour: colours.white,
    height: 5,
    duration: 1000,
    onComplete: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(100),
      currentProgress: null,
    }
  }

  reset() {
    this.animateProgress(100, 0);
  }

  start() {
    this.animateProgress(0, this.props.duration, this.props.onComplete);
  }

  stop() {
    this.state.progress.stopAnimation((val) => {
      this.currentProgress = val;
    });
  }

  restart() {
    this.reset();
    this.start();
  }

  animateProgress(val, duration, callback=null) {
    utils.animate(this.state.progress, val, duration, callback, Easing.linear);
  }

  render() {
    let { props, state } = this;
    return (
      <Animated.View style={[{
        height: props.height, backgroundColor: props.colour,
        width: state.progress.interpolate({
          inputRange: [0, 100], outputRange: ['0%', '100%'],
        }),
      }, props.style]} />
    )
  }
}
