import React, { Component } from 'react';
import { View } from 'react-native';

import Text from './Text';
import Icon from './Icon';
import NavigationService from '../../nav/NavigationService';
import { colours, fonts, styles } from '../../styles';

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
      <View style={[{ height: 60, flexDirection: 'row', alignItems: 'center' }, styles.bgTheme, styles.bottomShadow]}>
        <Icon
          icon="arrow-left" size={20} color={colours.white} style={{paddingLeft: 15}}
          onPress={() => {
            this.nav(props.route);
          }}
        />
        <Text style={[{paddingLeft: 15, marginTop: 5}, fonts.display, fonts.light]}>{props.title}</Text>
      </View>
    )
  }
}
