import React, { Component } from 'react';
import { View } from 'react-native';

import { styles, colours } from '../../styles';

export default class Container extends Component {
  static defaultProps = {
    bgColour: colours.white,
  }

  render() {
    let { props } = this;

    return (
      <View style={[styles.f1, { backgroundColor: props.bgColour }, props.style]}>
        {props.children}
      </View>
    )
  }
}
