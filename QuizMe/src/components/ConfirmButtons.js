import React, { Component } from 'react';
import { View } from 'react-native';

import Button from './Core/Button';
import { styles, colours } from '../styles';

export default class ConfirmButtons extends Component {
  static defaultProps = {
    onSuccess: null,
    onCancel: null,
    width: 120,
    justify: 'space-evenly',
    disabled: false,
  }

  render() {
    let { props } = this;

    return (
      <View style={[styles.row, {height: 50, justifyContent: props.justify}]}>
        <Button
          width={props.width} icon="check" btnColour={colours.success} fontColour={colours.white}
          onPress={props.onSuccess} disabled={props.disabled}
        />
        <Button
          width={props.width} icon="times" btnColour={colours.error} fontColour={colours.white}
          onPress={props.onCancel} disabled={props.disabled}
        />
      </View>
    )
  }
}
