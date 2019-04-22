import React, { Component } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-easy-toast';

import Text from './Text';
import { colours, styles } from '../../styles';

export default class _Toast extends Component {
  static defaultProps = {
    position: 'top',
    colour: colours.primary,
    textColour: colours.white,
  }

  show(msg) {
    this.refs.toast.show(
      <View><Text colour={this.props.textColour}>{msg}</Text></View>
    );
  }

  render() {
    let { props } = this;
    return (
      <Toast position="top" style={[styles.center, {
        height: 60, width: '100%', borderRadius: 0,
        backgroundColor: props.colour,
      }]} ref="toast" positionValue={0} />
    )
  }
}
