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
    roundEdge: false,
    iosAdjust: true,
  }

  render() {
    let { props } = this;
    let iosAdjust = props.iosAdjust && Platform.OS == 'ios' ? 15 : 0;
    let borderTopLeftRadius = props.roundEdge ? 50 : null;
    let borderBottomLeftRadius = props.roundEdge ? 50 : null;
    let borderTopRightRadius = props.roundEdge ? 50 : null;
    let borderBottomRightRadius = props.roundEdge ? 50 : null;

    return (
      <View 
        style={[
          styles.row, {
            height: 50 + iosAdjust, alignItems: 'center',
            justifyContent: props.justify,
          }
        ]}
      >
        {
          props.onCancel &&
          <Button
            style={styles.f1} height={50} borderRadius={0}
            borderTopLeftRadius={borderTopLeftRadius}
            borderBottomLeftRadius={borderBottomLeftRadius}
            icon={props.cancelIcon} padding={0} iosAdjust={props.iosAdjust}
            btnColour={colours.error} fontColour={colours.white}
            onPress={props.onCancel} disabled={props.disabled} borderWidth={0}
          />
        }
        <Button
          style={styles.f1} height={50} borderRadius={0}
          borderTopRightRadius={borderTopRightRadius}
          borderBottomRightRadius={borderBottomRightRadius}
          icon={props.successIcon} padding={0} iosAdjust={iosAdjust}
          btnColour={colours.success} fontColour={colours.white}
          onPress={props.onSuccess} disabled={props.disabled} borderWidth={0}
        />
      </View>
    )
  }
}
