import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { colours } from '../../styles';

export default class Header extends Component {
  static defaultProps = {
    style: {},
    onPress: null,
    colour: colours.grey,
    icon: null,
    size: 24,
  }
  render() {
    let { props } = this;
    return (
      <View style={props.style}>
        {
          !props.onPress &&
          <FontAwesomeIcon icon={props.icon} size={props.size} color={props.colour} />
        }
        {
          props.onPress &&
          <TouchableOpacity onPress={props.onPress}>
            <FontAwesomeIcon icon={props.icon} size={props.size} color={props.colour} />
          </TouchableOpacity>
        }
      </View>
    )
  }
}
