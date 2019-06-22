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
    borderTopLeftRadius: null,
    borderTopRightRadius: null,
    borderBottomLeftRadius: null,
    borderBottomRightRadius: null,
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
    flex: false,
    iosAdjust: false,  // Required for iOS if the button is at the bottom of the screen
  }

  render() {
    let { props } = this;
    let btnColour = props.btnColour;
    let fontColour = props.fontColour;
    let onPress = props.onPress;
    let activeOpacity = props.activeOpacity;
    let iosAdjust = props.iosAdjust && Platform.OS == 'ios' ? 15: 0;

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
        style: [styles.f1, styles.row],
        activeOpacity: activeOpacity, onPress: onPress,
      }
      
      labelBtn = (
        <View style={[touchableProps.style, { overflow: 'hidden' }]}>
          <TouchableNativeFeedback
            activeOpacity={activeOpacity} onPress={onPress}
            background={TouchableNativeFeedback.Ripple(rippleColour)}
          >
            <View style={[styles.f1, styles.row, {
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
            <View style={[styles.f1, styles.center, { 
              backgroundColor: btnColour 
            }]}>
              <Icon icon={props.icon} size={props.iconSize} colour={fontColour} />
            </View>
          </TouchableNativeFeedback>
        </View>
      );
    } else if (props.disabled || Platform.OS == 'ios') {
      let touchableProps = {
        style: [styles.f1, styles.row, {
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
          <View style={[
            styles.center, {
              width: props.width - (props.padding * 2),
              paddingBottom: iosAdjust,
            }, props.style,
          ]}>
            <Icon icon={props.icon} size={props.iconSize} colour={fontColour} />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={[
        {
          width: props.width, height: props.height + iosAdjust,
          borderRadius: props.borderRadius,
          borderTopLeftRadius: props.borderTopLeftRadius,
          borderTopRightRadius: props.borderTopRightRadius,
          borderBottomLeftRadius: props.borderBottomLeftRadius,
          borderBottomRightRadius: props.borderBottomRightRadius,
          backgroundColor: colours.white, borderColor: props.borderColour, 
          borderWidth: borderWidth, overflow: 'hidden',
        }, props.style
      ]}>
        {
          props.label && labelBtn
        }
        {
          !props.label && iconBtn
        }
      </View>
    )
  }
}
