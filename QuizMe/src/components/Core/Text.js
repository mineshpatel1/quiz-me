import React, { Component } from 'react';
import { Animated, Text } from 'react-native';

import { fonts, colours } from '../../styles';

export default class _Text extends Component {
  static defaultProps = {
    style: {},
    bold: false,
    display: false,
    colour: colours.grey,
    size: 18,
    align: 'left',
    animated: false,
    text: null,
  }

  render() {
    let { props } = this;
    let font = fonts.normal;
    if (props.bold) font = fonts.bold;
    if (props.display) font = fonts.display;

    let text = props.children
    if (props.text) text = props.text

    if (!props.animated) {
      return (
        <Text
          style={[
            font, {color: props.colour, fontSize: props.size, textAlign: props.align}, props.style
          ]}
        >{text}</Text>
      )
    } else {
      return (
        <Animated.Text
          style={[
            font, {color: props.colour, fontSize: props.size, textAlign: props.align}, props.style
          ]}
        >{text}</Animated.Text>
      )
    }
  }
}
