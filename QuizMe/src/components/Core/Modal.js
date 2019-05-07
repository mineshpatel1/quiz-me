import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";

import Icon from './Icon';
import { animationDuration } from '../../config';
import { styles, colours } from '../../styles'

export default class CustomModal extends Component {
  static defaultProps = {
    width: 350,
    height: 350,
    animationIn: 'slideInRight',
    animationOut: 'slideOutRight',
    theme: false,
    sidePadding: 35,
    paddingBottom: 15,
    closeBtn: true,
  }
  render() {
    let { props } = this;

    let bgColour = colours.white;
    let crossColour = colours.error;

    if (props.theme) {
      bgColour = colours.primary;
      crossColour = colours.white;
    }

    let mainHeight = props.height;
    if (props.closeBtn) mainHeight = props.height - 45;

    return (
      <Modal
        isVisible={props.isVisible}
        animationIn={props.animationIn}
        animationOut={props.animationOut}
        animationInTiming={animationDuration}
        animationOutTiming={animationDuration}
        onBackButtonPress={props.onCancel}
        onBackdropPress={props.onCancel}
        style={[styles.center]}
        backdropOpacity={0.75}
        useNativeDriver={true}
        hideModalContentWhileAnimating
        hardwareAccelerated
      >
        <View style={[
          {
            width: props.width, height: props.height,
            backgroundColor: bgColour, borderRadius: 5,
          },
        ]}>
          {
            props.closeBtn &&
            <View style={{
              height: 45, width: props.width, borderRadius: 0,
              flexDirection: 'row', paddingRight: 15,
              justifyContent: 'flex-end', alignItems: 'center',
            }}>
              <Icon colour={crossColour} icon={'times'} onPress={props.onCancel} />
            </View>
          }
          <View style={{
            width: props.width, height: mainHeight,
            paddingLeft: props.sidePadding, paddingRight: props.sidePadding,
            paddingBottom: props.paddingBottom, borderRadius: 5,
          }}>
            <View style={[{ flex: 1, overflow: 'hidden' }, props.style]}>
              {props.children}
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}
