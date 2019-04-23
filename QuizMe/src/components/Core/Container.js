import React, { Component } from 'react';
import { View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import { styles, colours } from '../../styles';

export default class Container extends Component {
  static defaultProps = {
    bgColour: colours.white,
    spinner: false,
  }

  render() {
    let { props } = this;

    return (
      <View style={[styles.f1, { backgroundColor: props.bgColour }, props.style]}>
        <Spinner visible={props.spinner} color={colours.white} animation='fade' />
        {props.children}
      </View>
    )
  }
}
