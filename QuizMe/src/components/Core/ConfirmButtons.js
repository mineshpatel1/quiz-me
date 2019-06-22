import React, { Component } from 'react';
import { Platform, View, TouchableNativeFeedback } from 'react-native';

import Icon from './Icon';
import Button from './Button';
import { styles, colours } from '../../styles';
import { utils } from '../../utils';

export default class ConfirmButtons extends Component {
  static defaultProps = {
    onSuccess: null,
    onCancel: null,
    width: 120,
    justify: 'space-evenly',
    disabled: false,
    successIcon: 'check',
    cancelIcon: 'times',
    iconSize: 26,
  }

  render() {
    let { props } = this;
    let iosAdjust = Platform.OS == 'ios' ? 15 : 0;

    return (
      <View 
        style={[
          styles.row, {height: 50 + iosAdjust, paddingBottom: iosAdjust,
          justifyContent: props.justify, alignItems: 'center'
        }]}
      >
        {
          props.onCancel &&
          <Button
            style={styles.f1} height={50 + iosAdjust} borderRadius={0}
            icon={props.cancelIcon} padding={0}
            btnColour={colours.error} fontColour={colours.white}
            onPress={props.onCancel} disabled={props.disabled} borderWidth={0}
          />
        }
        <Button
          style={styles.f1} height={50 + iosAdjust} borderRadius={0}
          icon={props.successIcon} padding={0}
          btnColour={colours.success} fontColour={colours.white}
          onPress={props.onSuccess} disabled={props.disabled} borderWidth={0}
        />
      </View>
    )
  }
}
