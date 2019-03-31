import React, { Component } from 'react';
import { View } from 'react-native';

import { styles } from '../../styles';

export default class Container extends Component {
  render() {
    let { props } = this;

    return (
      <View style={[styles.f1, props.style]}>
        {this.props.children}
      </View>
    )
  }
}
