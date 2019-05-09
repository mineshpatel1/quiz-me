import React, { Component } from 'react';
import { Platform, View } from 'react-native';

import Text from './Text';
import Icon from './Icon';
import NavigationService from '../../nav/NavigationService';
import { colours, fonts, styles } from '../../styles';

export default class Header extends Component {
  static defaultProps = {
    height: 60,
  }

  nav(route) {
    console.log(route);
    if (route) {
      NavigationService.navigate(route);
    } else {
      NavigationService.back();
    }
  }

  render() {
    let { props } = this;
    let iosAdjust = Platform.OS == 'ios' ? 25 : 0;

    return (
      <View style={[
        styles.row, styles.aCenter, styles.bgTheme, styles.bottomShadow,
        { height: props.height + iosAdjust, paddingTop: iosAdjust },
      ]}>
        <Icon
          icon="arrow-left" size={20} colour={colours.white} style={{paddingLeft: 15}}
          onPress={() => {
            this.nav(props.route);
          }}
        />
        <Text style={[{paddingLeft: 15, marginTop: 5}, fonts.light]} display={true} size={24}>{props.title}</Text>
      </View>
    )
  }
}
