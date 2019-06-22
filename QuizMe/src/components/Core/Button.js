import React, { Component } from 'react';
import { Platform, View, TouchableOpacity, TouchableNativeFeedback } from 'react-native';

import Text from './Text';
import Icon from './Icon';
import { styles, colours } from '../../styles';
import { utils } from '../../utils';

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
    iconSize: 20,
    rippleHighlight: -40,
    borderWidth: 1,
    borderColour: colours.softGrey,
  }

  render() {
    let { props } = this;
    let btnColour = props.btnColour;
    let fontColour = props.fontColour;
    let onPress = props.onPress;
    let activeOpacity = props.activeOpacity;

    if (props.disabled) {
      btnColour = colours.disabled;
      fontColour = colours.midGrey;
      onPress = null;
      activeOpacity = 1;
    }

    let borderWidth = props.borderWidth;
    if (props.disabled) borderWidth = 0;

    let labelBtn, iconBtn;
    if (!props.disabled && Platform.OS == 'android') {

      let rippleColour = utils.alterBrightness(btnColour, props.rippleHighlight);
      let touchableProps = {
        style: [styles.f1, styles.row, {
          borderRadius: props.borderRadius,
        }],
        activeOpacity: activeOpacity, onPress: onPress,
      }
      
      labelBtn = (
        <View style={[touchableProps.style, { overflow: 'hidden' }]}>
          <TouchableNativeFeedback
            activeOpacity={activeOpacity} onPress={onPress}
            background={TouchableNativeFeedback.Ripple(rippleColour)}
          >
            <View style={[styles.f1, styles.row, {
              borderRadius: props.borderRadius,
              paddingLeft: props.padding - 15, backgroundColor: btnColour,
            }]}>
              <View style={[styles.f2, {
                justifyContent: 'center', alignItems: 'flex-start', marginLeft: 20,
              }]}>
                <Text bold={true} colour={fontColour}>{props.label}</Text>
              </View>
              <View style={[styles.f1, {
                justifyContent: 'center', alignItems: 'flex-end', paddingRight: props.padding,
              }]}>
                <Icon icon={props.icon} size={props.iconSize} colour={fontColour} />
              </View>
            </View>
          </TouchableNativeFeedback>
        </View>        
      );

      iconBtn = (
        <View style={[touchableProps.style, { overflow: 'hidden' }]}>
          <TouchableNativeFeedback 
            activeOpacity={activeOpacity} onPress={onPress}
            background={TouchableNativeFeedback.Ripple(rippleColour)}
          >
            <View style={[styles.f1, styles.center, { borderRadius: props.borderRadius, backgroundColor: btnColour }]}>
              <Icon icon={props.icon} size={props.iconSize} colour={fontColour} />
            </View>
          </TouchableNativeFeedback>
        </View>
      );
    } else if (props.disabled || Platform.OS == 'ios') {
      let touchableProps = {
        style: [styles.f1, styles.row, {
          borderRadius: props.borderRadius,
          paddingLeft: props.padding,
          backgroundColor: btnColour,
        }],
        activeOpacity: activeOpacity, onPress: onPress,
      }
      
      labelBtn = (
        <TouchableOpacity {...touchableProps}>
          <View style={[styles.f1, styles.row]}>
            <View style={[styles.f2, {
              justifyContent: 'center', alignItems: 'flex-start',
            }]}>
              <Text bold={true} colour={fontColour}>{props.label}</Text>
            </View>
            <View style={[styles.f1, {
              justifyContent: 'center', alignItems: 'flex-end', paddingRight: props.padding,
            }]}>
              <Icon icon={props.icon} size={props.iconSize} colour={fontColour} />
            </View>
          </View>
        </TouchableOpacity>
      );

      iconBtn = (
        <TouchableOpacity {...touchableProps}>
          <View style={[styles.center, {width: props.width - (props.padding * 2)}]}>
            <Icon icon={props.icon} size={props.iconSize} colour={fontColour} />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={[
        {
          width: props.width, height: props.height, borderRadius: props.borderRadius,
          backgroundColor: colours.white, borderColor: props.borderColour, 
          borderWidth: borderWidth,
        }, props.style
      ]}>
        {
          props.label && props.icon && labelBtn
        }
        {
          !props.label && props.icon && iconBtn
        }
      </View>
    )
  }
}
