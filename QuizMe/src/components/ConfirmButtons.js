import React, { Component } from 'react';
import { View } from 'react-native';

import Button from './Core/Button';
import { styles, colours } from '../styles';

export default class ConfirmButtons extends Component {
  static defaultProps = {
    onSuccess: null,
    onCancel: null,
    width: 120,
  }

  render() {
    let { props } = this;

    return (
      <View style={[styles.row, {justifyContent: 'space-evenly'}]}>
        <Button
          width={props.width} icon="check" btnColor={colours.success} fontColor={colours.white}
          onPress={props.onSuccess}
        />
        <Button
          width={props.width} icon="times" btnColor={colours.error} fontColor={colours.white}
          onPress={props.onCancel}
        />
      </View>
    )
  }
}
