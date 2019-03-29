import React, { Component } from 'react';
import { Platform, View, StyleSheet, TouchableOpacity } from 'react-native';

import { Header, Text } from '../components/Core';

export default class Settings extends Component {
  render() {
    return (
      <View>
        <Header title="Settings" route="Home"/>
      </View>
    )
  }
}
