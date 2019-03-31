import React, { Component } from 'react';
import { Text } from 'react-native';

import { fonts, colours } from '../../styles';

export default class _Text extends Component {
  static defaultProps = {
    style: {},
    bold: false,
    color: colours.grey,
    size: 18,
  }

  render() {
    let { props } = this;
    let font = fonts.normal;
    if (props.bold) {
      font = fonts.bold;
    }

    return (
      <Text style={[
        font, {color: props.color, fontSize: props.size}, props.style
      ]}>{this.props.children}</Text>
    )
  }
}
