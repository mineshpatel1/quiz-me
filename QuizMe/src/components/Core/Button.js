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

    let labelBtn, iconBtn;
    if (Platform.OS == 'android') {

      let rippleColour = utils.alterColour(btnColour, props.rippleHighlight);
      let touchableProps = {
        style: [styles.f1, styles.row, {
          borderRadius: props.borderRadius,
        }],
        activeOpacity: activeOpacity, onPress: onPress,
      }
      
      labelBtn = (
        <TouchableNativeFeedback 
          {...touchableProps} background={TouchableNativeFeedback.Ripple(rippleColour, true)}
        >
          <View style={[styles.f1, styles.row, {
            borderRadius: props.borderRadius,
            paddingLeft: props.padding - 15, backgroundColor: btnColour,
          }]}>
            <View style={[styles.f2, {
              justifyContent: 'center', alignItems: 'flex-start', marginLeft: 20,
            }]}>
              <Text bold={true} colour={props.fontColour}>{props.label}</Text>
            </View>
            <View style={[styles.f1, {
              justifyContent: 'center', alignItems: 'flex-end', paddingRight: props.padding,
            }]}>
              <Icon icon={props.icon} size={props.iconSize} colour={props.fontColour} />
            </View>
          </View>
        </TouchableNativeFeedback>
      );

      iconBtn = (
        <TouchableNativeFeedback 
          {...touchableProps} background={TouchableNativeFeedback.Ripple(rippleColour, true)}
        >
          <View style={[styles.f1, styles.center, { borderRadius: props.borderRadius, backgroundColor: btnColour }]}>
            <Icon icon={props.icon} size={props.iconSize} colour={props.fontColour} />
          </View>
        </TouchableNativeFeedback>
      );
    } else if (Platform.OS != 'ios') {
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
              <Text bold={true} colour={props.fontColour}>{props.label}</Text>
            </View>
            <View style={[styles.f1, {
              justifyContent: 'center', alignItems: 'flex-end', paddingRight: props.padding,
            }]}>
              <Icon icon={props.icon} size={props.iconSize} colour={props.fontColour} />
            </View>
          </View>
        </TouchableOpacity>
      );

      iconBtn = (
        <TouchableOpacity {...touchableProps}>
          <View style={[styles.center, {width: props.width - (props.padding * 2)}]}>
            <Icon icon={props.icon} size={props.iconSize} colour={props.fontColour} />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={[styles.shadow,
        {
          width: props.width, height: props.height, borderRadius: props.borderRadius,
          backgroundColor: colours.white,
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
