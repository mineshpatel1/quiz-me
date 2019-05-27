import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import Text from './Text';
import { colours } from '../../styles';

export default class Icon extends Component {
  static defaultProps = {
    style: {},
    onPress: null,
    colour: colours.grey,
    icon: null,
    size: 24,
    badge: null,
  }
  render() {
    let { props } = this;
    let showBadge = props.badge > 0;
    return (
      <View style={props.style}>
        {
          !props.onPress &&
          <FontAwesomeIcon icon={props.icon} size={props.size} color={props.colour} />
        }
        {
          props.onPress &&
          <TouchableOpacity onPress={props.onPress} activeOpacity={0.75} >
            <FontAwesomeIcon icon={props.icon} size={props.size} color={props.colour} />
          </TouchableOpacity>
        }
        {
          showBadge &&
          <View style={{
            position: 'absolute',
            top: -5,
            right: -5,
            minWidth: 15,
            height: 15,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colours.error,
          }}>
            <Text colour={colours.white} size={10}>{props.badge}</Text>
          </View>
        }
      </View>
    )
  }
}
