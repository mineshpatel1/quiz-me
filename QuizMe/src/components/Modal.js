import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";

import { Icon } from './Core';
import { animationDuration } from '../config';
import { styles, colours } from '../styles'

export default class CustomModal extends Component {
  static defaultProps = {
    width: 350,
    height: 350,
    animationIn: 'slideInRight',
    animationOut: 'slideOutRight',
    theme: false,
  }
  render() {
    let { props } = this;

    const sidePadding = 35;
    let bgColour = colours.white;
    let crossColour = colours.error;

    if (props.theme) {
      bgColour = colours.primary;
      crossColour = colours.white;
    }

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
          <View style={{
            height: 45, width: props.width, borderRadius: 0,
            flexDirection: 'row', paddingRight: 15,
            justifyContent: 'flex-end', alignItems: 'center',
          }}>
            <TouchableOpacity onPress={props.onCancel}>
              <Icon colour={crossColour} icon={'times'} />
            </TouchableOpacity>
          </View>
          <View style={{
            width: props.width, height: props.height - 45,
            paddingLeft: sidePadding, paddingRight: sidePadding,
            paddingBottom: 15, borderRadius: 5,
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
