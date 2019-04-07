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
  }

  componentDidMount() { this.mounted = true; }
  componentWillUnmount() { this.mounted = false; }

  constructor(props) {
    super(props);

    this.state = {
      timer: props.length,
      paused: props.paused,
    };

    if (props.auto) this.start();
  }

  start() {
    let { props } = this;
    this.state.intervalId = setInterval(() => {
      if (this.mounted) {
        if (this.state.timer > props.end && !this.state.paused) {
          if ((this.state.timer - props.increment) == props.end) {
            this.setState(prev => (
              { timer: prev.timer - props.increment }
            ));
            if (props.onFinish) props.onFinish();
            this.stop();
          } else {
            this.setState(prev => (
              { timer: prev.timer - props.increment }
            ));
          }
        }
      } else {
        this.stop();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.state.intervalId);
  }

  togglePaused() {
    this.setState({ paused: !this.state.paused });
  }

  reset() {
    this.setState({ timer: this.props.length });
  }

  restart() {
    this.reset();
    this.start();
  }

  render() {
    let {props, state} = this;

    return (
      <Text {...props}>
        {props.format(state.timer)}
      </Text>
    )
  }
}
