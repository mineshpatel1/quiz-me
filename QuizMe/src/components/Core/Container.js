import React, { Component } from 'react';
import { View } from 'react-native';

import { styles, colours } from '../../styles';

export default class Container extends Component {
  static defaultProps = {
    bgColor: colours.white,
  }

  render() {
    let { props } = this;

    return (
      <View style={[styles.f1, { backgroundColor: props.bgColor }, props.style]}>
        {props.children}
      </View>
    )
  }
}
