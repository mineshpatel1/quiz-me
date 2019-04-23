import React, { Component } from 'react';
import { View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from "@react-native-community/netinfo";

import { styles, colours } from '../../styles';

export default class Container extends Component {
  static defaultProps = {
    bgColour: colours.white,
    spinner: false,
    onConnectionChange: null,
  }

  componentWillMount() {
    if (this.props.onConnectionChange) {
      NetInfo.addEventListener('connectionChange', (info) => {
        this.props.onConnectionChange(info, this.online(info));
      });
    }
  }

  componentWillUnmount() {
    if (this.props.onConnectionChange) {
      NetInfo.removeEventListener('connectionChange', (info) => {
        this.props.onConnectionChange(info, this.online(info));
      });
    }
  }

  online(info) {
    return ['none', 'unknown'].indexOf(info.type) == -1;
  }

  render() {
    let { props } = this;

    return (
      <View style={[styles.f1, { backgroundColor: props.bgColour }, props.style]}>
        <Spinner visible={props.spinner} color={colours.white} animation='fade' />
        {props.children}
      </View>
    )
  }
}
