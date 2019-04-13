import React, { Component } from 'react';
import { Animated, View, Easing, } from 'react-native';
import { Svg, Path, G } from 'react-native-svg';

import { utils } from '../utils';
import { styles, colours } from '../styles';

import ProgressCircle from './ProgressCircle';
const AnimatedProgress = Animated.createAnimatedComponent(ProgressCircle);

export default class AnimatedProgressCircle extends Component {

  static defaultProps = {
    duration: 500,
    easing: Easing.quad,
    minColour: 'red',
    maxColour: 'green',
  }

  constructor(props) {
    super(props);
    this.state = {
      fill: new Animated.Value(0),
      colour: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.animate();
  }

  animate(toVal, dur, ease) {
    const toValue = toVal >= 0 ? toVal : this.props.fill;
    const duration = dur || this.props.duration;
    const easing = ease || this.props.easing;

    Animated.timing(this.state.fill, {
      toValue, easing, duration,
    }).start();

    Animated.timing(this.state.colour, {
      toValue, easing, duration,
    }).start();
  }

  render() {
    let { state, props } = this;
    const { fill, ...other } = props;

    return (
      <AnimatedProgress
        {...other} fill={state.fill}
        tintColour={state.colour.interpolate({
          inputRange: [0, 100],
          outputRange: [props.minColour, props.maxColour],
        })}
      />
    );
  }
}
