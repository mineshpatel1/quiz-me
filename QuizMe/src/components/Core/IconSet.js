import React, { Component } from 'react';
import { Platform, View } from 'react-native';

import Icon from './Icon';
import NavigationService from '../../nav/NavigationService';
import { styles, colours } from '../../styles';

export default class IconSet extends Component {
  static defaultProps = {
    links: [],
    colour: colours.grey,
    borderColour: colours.grey,
    bottom: true,
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

    return (
      <View style={[styles.row, styles.center, { 
        height: 50 + iosAdjust, paddingBottom: iosAdjust,
        borderTopWidth: 1, borderColor: props.borderColour,
      }]}>
        {
          props.links.map((link, i) => (
            <Icon
              key={i} onPress={() => this.action(link)}
              size={26} icon={link.icon} colour={props.colour}
              style={{ marginLeft: i == 0 ? 0 : 15 }}
            />
          ))
        }
      </View>
    )
  }
}