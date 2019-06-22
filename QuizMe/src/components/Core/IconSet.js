import React, { Component } from 'react';
import { Platform, View } from 'react-native';

import Icon from './Icon';
import NavigationService from '../../nav/NavigationService';
import { styles, colours } from '../../styles';

export default class IconSet extends Component {
  static defaultProps = {
    links: [],
    colour: colours.white,
    borderColour: null,
    backgroundColour: colours.primary,
    bottom: true,
    iconSize : 26,
  }
  
  action(linkProps) {
    if (linkProps.nav) {
      NavigationService.navigate(linkProps.nav);
    } else if (linkProps.onPress) {
      linkProps.onPress();
    }
  }

  render() {
    let { props } = this;
    let iosAdjust = Platform.OS == 'ios' ? 15: 0;
    let border = props.borderColour ? 1: 0;

    return (
      <View style={[styles.row, styles.center, { 
        width: '100%', height: 50 + iosAdjust, paddingBottom: iosAdjust,
        backgroundColor: props.backgroundColour, borderTopWidth: border,
        borderColor: props.borderColour,
      }]}>
        {
          props.links.map((link, i) => (
            <Icon
              key={i} onPress={() => this.action(link)}
              size={props.iconSize} icon={link.icon} colour={props.colour}
              style={{ marginLeft: i == 0 ? 0 : 25 }}
              badge={link.badge}
            />
          ))
        }
      </View>
    )
  }
}