import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';

import Text from './Text';
import Icon from './Icon';
import { styles, colours, fonts } from '../../styles';

export default class Button extends Component {
  static defaultProps = {
    label: null,
    icon: null,
    width: 300,
    height: 50,
    borderRadius: 50,
    padding: 25,
    btnColour: colours.light,
    fontColour: colours.grey,
    disabled: false,
    style: null,
    activeOpacity: 0.7,
  }

  render() {
    let { props } = this;
    let btnColour = props.btnColour;
    let onPress = props.onPress;
    let activeOpacity = props.activeOpacity;

    if (props.disabled) {
      btnColour = colours.disabled;
      onPress = null;
      activeOpacity = 1;
    }

    let touchableProps = {
      style: [styles.f1, styles.row, {
        paddingLeft: props.padding, borderRadius: props.borderRadius,
        backgroundColor: btnColour,
      }],
      activeOpacity: activeOpacity, onPress: onPress,
    }

    return (
      <View style={[styles.shadow,
        {
          width: props.width, height: props.height, borderRadius: props.borderRadius,
          backgroundColor: colours.white,
        }, props.style
      ]}>
        {
          props.label && props.icon &&
          <TouchableOpacity {...touchableProps}>
            <View style={[styles.f2, {
              justifyContent: 'center', alignItems: 'flex-start',
            }]}>
              <Text bold={true} colour={props.fontColour}>{props.label}</Text>
            </View>
            <View style={[styles.f1, {
              justifyContent: 'center', alignItems: 'flex-end', paddingRight: props.padding,
            }]}>
              <Icon icon={props.icon} size={20} colour={props.fontColour} />
            </View>
          </TouchableOpacity>
        }
        {
          props.icon && !props.label &&
          <TouchableOpacity {...touchableProps}>
            <View style={[styles.center, {width: props.width - (props.padding * 2)}]}>
              <Icon icon={props.icon} size={20} colour={props.fontColour} />
            </View>
          </TouchableOpacity>
        }
      </View>
    )
  }
}
