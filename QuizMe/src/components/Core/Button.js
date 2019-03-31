import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';

import Text from './Text';
import Icon from './Icon';
import { styles, colours, fonts } from '../../styles';

export default class Button extends Component {
  static defaultProps = {
    width: 300,
    height: 50,
    borderRadius: 50,
    padding: 25,
    fontColor: colours.grey,
  }

  render() {
    let { props } = this;
    let touchableProps = {
      style: [styles.f1, styles.row, {
        paddingLeft: props.padding, borderRadius: props.borderRadius
      }],
      onPress: props.onPress,
    }

    return (
      <View style={[styles.shadow,
        {
          width: props.width, height: props.height, borderRadius: props.borderRadius,
          backgroundColor: colours.light,
        }, props.style
      ]}>
        {
          props.label && props.icon &&
          <TouchableOpacity {...touchableProps}>
            <View style={[styles.f2, {
              justifyContent: 'center', alignItems: 'flex-start',
            }]}>
              <Text bold={true} color={props.fontColor}>{props.label}</Text>
            </View>
            <View style={[styles.f1, {
              justifyContent: 'center', alignItems: 'flex-end', paddingRight: props.padding,
            }]}>
              <Icon icon={props.icon} size={20} color={props.fontColor} />
            </View>
          </TouchableOpacity>
        }
      </View>
    )
  }
}
