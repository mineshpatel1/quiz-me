import React, { Component } from 'react';
import { View } from 'react-native';

import NavigationService from '../nav/NavigationService';
import Text from './Text';
import Icon from './Icon';
import { colours, fonts, style } from '../styles';

export default class Header extends Component {
  nav(route) {
    if (route) {
      NavigationService.navigate(route);
    } else {
      NavigationService.back();
    }
  }

  render() {
    let { props } = this;
    return (
      <View style={[{ height: 60, flexDirection: 'row', alignItems: 'center' }, style.bgTheme, style.shadow]}>
        <Icon
          icon="arrow-left" size={20} color={colours.white} style={{paddingLeft: 10}}
          onPress={() => {this.nav(props.route)}}
        />
        <Text style={[{paddingLeft: 15, marginTop: 4}, fonts.display, fonts.light]}>{props.title}</Text>
      </View>
    )
  }
}
