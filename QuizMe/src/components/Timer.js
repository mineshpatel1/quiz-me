import React from 'react';
import { Animated, View } from 'react-native';

import { Text } from './Core';
import { utils } from '../utils';
import { style } from '../styles';

export default class Timer extends React.Component {
  static defaultProps = {
    format: utils.formatSeconds,
    end: 0,
    increment: 1,
    auto: true,
    invisible: false,
    interval: 1000,  // Seconds
    onFinish: null,
  }

  componentDidMount() {
    this.mounted = true;
    if (this.props.auto) this.tick();
  }
  componentWillUnmount() {
    clearInterval(this.state.intervalId);
    this.mounted = false;
  }

  constructor(props) {
    super(props);

    this.state = {
      timeLeft: props.length * 1000,  // Time in milliseconds
      timeElapsed: 0,
      displayTime: props.length,
      prevTime: null,
      pauseTime: null,
      timeoutId: null,
    };
  }

  tick() {
    let { props, state } = this;
    const currentTime = Date.now();
    let prevTime = state.prevTime;

    let diff;
    if (!state.pauseTime) {
      diff = state.prevTime ? currentTime - state.prevTime : 0;
    } else {
      diff = state.prevTime ? state.pauseTime - state.prevTime: 0;
    }
    const timeElapsed = state.timeElapsed + diff;
    const timeLeft = Math.max(state.timeLeft - diff, 0);

    let timeout = props.interval - (timeElapsed % props.interval)
    const finished = timeLeft <= 0;

    if (this.mounted) {
      this.setState({
        timeoutId: finished ? null : setTimeout(() => {
          this.tick();
        }, timeout),
        prevTime: currentTime,
        timeLeft: timeLeft,
        timeElapsed: timeElapsed,
        displayTime: Math.round(timeLeft / 1000),
        pauseTime: null,
      });

      if (finished && props.onFinish) props.onFinish();
    }
  }

  start() {
    this.tick();
  }

  stop() {
    clearInterval(this.state.timeoutId);
    this.setState({ pauseTime: Date.now() });
  }

  reset() {
    let { props } = this;
    this.setState({
      timeLeft: props.length * 1000,  // Time in milliseconds
      timeElapsed: 0,
      displayTime: props.length,
      prevTime: null,
      timeoutId: null,
    });
  }

  restart() {
    this.reset();
    this.start();
  }

  render() {
    let {props, state} = this;

    if (!props.invisible) {
      return (
        <Text {...props}>
          {props.format(state.displayTime)}
        </Text>
      )
    } else {
      return (
        <View {...props} />
      )
    }
  }
}
