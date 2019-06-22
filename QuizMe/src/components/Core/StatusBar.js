import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import { colours } from '../../styles';

export default class _StatusBar extends Component {
  static defaultProps = {
    colour: colours.primary,
    lightContent: true,
  }

  render() {
    let { props } = this;
    let barStyle = 'light-content';
    if (!props.lightContent) barStyle = 'dark-content';

    return (
      <StatusBar animated={true} backgroundColor={props.colour} barStyle={barStyle} />
    )
  }
}