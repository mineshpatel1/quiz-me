import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

export default class Header extends Component {
  static defaultProps = {
    style: {},
    onPress: null,
  }
  render() {
    let { props } = this;
    return (
      <View style={props.style}>
        {
          !props.onPress &&
          <FontAwesomeIcon icon={props.icon} size={props.size} color={props.color} />
        }
        {
          props.onPress &&
          <TouchableOpacity onPress={props.onPress}>
            <FontAwesomeIcon icon={props.icon} size={props.size} color={props.color} />
          </TouchableOpacity>
        }
      </View>
    )
  }
}
