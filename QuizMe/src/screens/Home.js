import React, { Component } from 'react';
import { Platform, View, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { Text, Icon, Button } from '../components/Core';
import { colours, style } from '../styles';

export default class Home extends Component {
  render() {
    let { props } = this;
    return (
      <View style={[style.f1, style.center, style.bgTheme ]}>
        <View style={[style.f1, {justifyContent: 'flex-end', alignItems: 'center'}]}>
          <Image style={{width: 400, height: 150}} source={require('../../assets/images/title.png')} />
        </View>

        <View style={[style.f1, style.center]}>
          <Button label="Settings" icon="cog" onPress={() => { props.navigation.navigate('Settings') }}/>
        </View>
      </View>

    );
  }
}
