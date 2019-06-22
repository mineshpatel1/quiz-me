import React, { Component } from 'react';
import { View } from 'react-native';

import Text from './Text';
import Modal from './Modal';
import ConfirmButtons from './ConfirmButtons';
import { styles } from '../../styles';

export default class ConfirmModal extends Component {
  static defaultProps = {
    isVisible: false,
    onSuccess: null,
    onCancel: null,
    onReject: null,
    message: "",
    fontSize: 24,
    btnWidth: 120,
    width: 350,
    animationIn: 'fadeInUp',
    animationOut: 'fadeOutDown',
  }

  render() {
    let { props } = this;
    let { 
      isVisible, onSuccess, onCancel, onReject, 
      message, fontSize, ...otherProps
    } = props;

    return (
      <Modal
        isVisible={isVisible} onCancel={() => onCancel()}
        animationIn={props.animationIn}
        animationOut={props.animationOut}
        style={[styles.center]} {...otherProps}
      >
        <View style={[styles.col]}>
          <View style={[styles.f1, styles.center]} >
            <Text size={props.fontSize} align="center">{props.message}</Text>
          </View>
          <View style={{ marginBottom: 10, width: props.width - 70 }}>
            <ConfirmButtons
              justify="space-between"
              onSuccess={() => onSuccess()}
              onCancel={() => {
                if (onReject) return onReject();
                onCancel();
              }}
              width={props.btnWidth}
              iosAdjust={false}
              roundEdge={true}
            />
          </View>
        </View>
      </Modal>
    )
  }
}