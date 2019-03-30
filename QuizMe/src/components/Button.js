import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';

import Text from './Text';
import Icon from './Icon';
import { style, colours } from '../styles';

export default class Button extends Component {
  static defaultProps = {
    width: 300,
    height: 50,
    borderRadius: 50,
    padding: 25,
  }

  render() {
    let { props } = this;
    let touchableProps = {
      style: [style.f1, style.row, {
        paddingLeft: props.padding, borderRadius: props.borderRadius
      }],
      onPress: props.onPress,
    }

    return (
      <View style={[
        [{
          width: props.width, height: props.height, borderRadius: props.borderRadius,
          backgroundColor: colours.light, elevation: 2,
        }]
      ]}>
        {
          props.label && props.icon &&
          <TouchableOpacity {...touchableProps}>
            <View style={[style.f2, {
              justifyContent: 'center', alignItems: 'flex-start',
            }]}>
              <Text>{props.label}</Text>
            </View>
            <View style={[style.f1, {
              justifyContent: 'center', alignItems: 'flex-end', paddingRight: props.padding,
            }]}>
              <Icon icon={props.icon} size={20} />
            </View>
          </TouchableOpacity>
        }
      </View>
    )
  }
}
