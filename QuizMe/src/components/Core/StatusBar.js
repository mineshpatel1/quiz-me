import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import { colours } from '../../styles';

export default class _StatusBar extends Component {
  static defaultProps = {
    colour: colours.primary,
    barStyle: 'light-content',
  }

  render() {
    let { props } = this;

    return (
      <StatusBar animated={true} backgroundColor={props.colour} barStyle={props.barStyle} />
    )
  }
}