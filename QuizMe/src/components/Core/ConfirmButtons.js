import React, { Component } from 'react';
import { View } from 'react-native';

import Button from './Button';
import { styles, colours } from '../../styles';

export default class ConfirmButtons extends Component {
  static defaultProps = {
    onSuccess: null,
    onCancel: null,
    width: 120,
    justify: 'space-evenly',
    disabled: false,
    successIcon: 'check',
    cancelIcon: 'times',
  }

  render() {
    let { props } = this;

    return (
      <View style={[styles.row, {height: 50, justifyContent: props.justify}]}>
        <Button
          width={props.width} icon={props.successIcon} btnColour={colours.success} fontColour={colours.white}
          onPress={props.onSuccess} disabled={props.disabled} borderWidth={0}
        />
        {
          props.onCancel &&
          <Button
            width={props.width} icon={props.cancelIcon} btnColour={colours.error} fontColour={colours.white}
            onPress={props.onCancel} disabled={props.disabled} borderWidth={0}
          />
        }
      </View>
    )
  }
}
