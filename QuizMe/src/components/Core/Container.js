import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from "@react-native-community/netinfo";

import Header from './Header';
import StatusBar from './StatusBar';
import { styles, colours } from '../../styles';
import { utils } from '../../utils';

export default class Container extends Component {
  static defaultProps = {
    bgColour: colours.white,
    spinner: false,
    onConnectionChange: null,
    header: null,
  }

  componentDidMount() {
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
    let statusColour = props.bgColour == colours.white ? colours.primary : props.bgColour;
    let iosAdjust = Platform.OS == 'ios' && !props.header ? 25 : 0;

    let header = props.header;
    if (props.header && typeof(props.header) == 'string') {
      header = { title: props.header };
    }

    if (utils.isDark(statusColour)) {
      statusColour = utils.alterBrightness(statusColour, +50);
    } else {
      statusColour = utils.alterBrightness(statusColour, -50);
    }

    return (
      <View style={[styles.f1, { backgroundColor: props.bgColour, paddingTop: iosAdjust }, props.style]}>
        <StatusBar colour={statusColour} />
        <Spinner visible={props.spinner} color={colours.white} animation='fade' />
        {
          props.header &&
          <Header title={header.title} route={header.route} />
        }
        {props.children}
      </View>
    )
  }
}
