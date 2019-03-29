import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default class Settings extends Component {
  render() {
    return (
      <TouchableOpacity onPress={() => {this.props.navigation.goBack()}}>
        <Text>Back</Text>
      </TouchableOpacity>
    )
  }
}
