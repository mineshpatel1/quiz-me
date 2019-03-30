import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { Icon } from '../components/Core';
import { style } from '../styles';

export default class Home extends Component {
  render() {
    return (
      <View style={[style.f1, style.center, style.bgTheme ]}>
        <View style={{width: 400, height: 150}}>
          <Image style={{width: 400, height: 150}} source={require('../../assets/images/title.png')} />
        </View>
        <TouchableOpacity onPress={() => {this.props.navigation.navigate('Settings')}}>
          <Text style={{fontFamily: 'Lato-Regular'}}>Navigate</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
