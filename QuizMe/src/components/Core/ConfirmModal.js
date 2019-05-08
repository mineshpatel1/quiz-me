import React, { Component } from 'react';
import { View } from 'react-native';

import Text from './Text';
import Modal from './Modal';
import ConfirmButtons from './ConfirmButtons';
import { styles, colours } from '../../styles';

export default class ConfirmModal extends Component {
  static defaultProps = {
    isVisible: false,
    onSuccess: null,
    onCancel: null,
    message: "",
    fontSize: 24,
  }

  render() {
    let { props } = this;
    let { isVisible, onSuccess, onCancel, message, fontSize, ...otherProps} = props;

    return (
      <Modal
        isVisible={isVisible} onCancel={() => onCancel()}
        style={[styles.center]} {...otherProps}
      >
        <View style={[styles.col]}>
          <View style={[styles.f1, styles.center]} >
            <Text size={props.fontSize}>{props.message}</Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <ConfirmButtons
              justify="space-between"
              onSuccess={() => onSuccess()}
              onCancel={() => onCancel()}
            />
          </View>
        </View>
      </Modal>
    )
  }
}