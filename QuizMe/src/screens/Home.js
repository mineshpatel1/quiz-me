import React, { Component } from 'react';
import { Platform, View, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { Text, Icon, Button } from '../components';
import { colours, styles } from '../styles';

export default class Home extends Component {
  render() {
    let { props } = this;
    return (
      <View style={[styles.f1, styles.center, styles.bgTheme ]}>
        <View style={[styles.f1, {justifyContent: 'flex-end', alignItems: 'center'}]}>
          <Image style={{width: 400, height: 150}} source={require('../../assets/images/title.png')} />
        </View>

        <View style={[styles.f1, styles.center]}>
          <Button label="Settings" icon="cog" onPress={() => { props.navigation.navigate('Settings') }}/>
        </View>
      </View>

    );
  }
}
