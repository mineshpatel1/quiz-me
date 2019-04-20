import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';

import Icon from './Icon';
import { colours } from '../../styles';

export default class IconButton extends Component {
  static defaultProps = {
    icon: null,
    onPress: null,
    colour: colours.white,
    activeOpacity: 0.75,
    size: 24,
  }
  render() {
    let { props } = this;
    return (
      <View style={props.style}>
        <TouchableOpacity onPress={props.onPress} activeOpacity={props.activeOpacity}>
          <Icon icon={props.icon} colour={props.colour} size={props.size} />
        </TouchableOpacity>
      </View>
    )
  }
}
