import React, { Component } from 'react';
import { Text } from 'react-native';

import { fonts } from '../styles';

export default class _Text extends Component {
  static defaultProps = {
    style: {},
  }

  render() {
    let { props } = this;
    return (
      <Text style={[fonts.normal, props.style]}>{this.props.children}</Text>
    )
  }
}
