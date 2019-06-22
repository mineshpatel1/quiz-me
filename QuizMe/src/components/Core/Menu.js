import React, { Component } from 'react';
import { Platform, ScrollView, View, TouchableOpacity, TouchableNativeFeedback } from 'react-native';

import Text from './Text';
import Icon from './Icon';
import { styles, colours } from '../../styles';

export default class Menu extends Component {
  static defaultProps = {
    menu: null,
    height: 60,
  }

  render() {
    let { props } = this;

    let menuItem = (key, item) => {
      let _style = {
        height: props.height, width: '100%', borderBottomWidth: 1, borderColor: colours.softGrey,
      };

      let containerStyle = [
        styles.row, styles.aCenter, {
          height: props.height, width: '100%', justifyContent: 'space-between',
          paddingLeft: 15, paddingRight: 15,
        }
      ];

      let colour = item.disabled ? colours.lightGrey : undefined;
      let onPress = item.disabled ? null : item.onPress;

      if (!item.disabled && Platform.OS == 'android') {
        return (
          <View key={key} style={_style}>
            <TouchableNativeFeedback
              onPress={onPress}
              background={TouchableNativeFeedback.Ripple(colours.lightGrey, true)}
            >
              <View style={containerStyle}>
                <Text style={styles.f1} colour={colour} size={16}>{item.label}</Text>
                {
                  item.subLabel &&
                  <Text style={styles.f2} colour={colours.lightGrey} size={14}>{item.subLabel}</Text>
                }
                {
                  item.icon &&
                  <Icon
                    style={{width: 25}}
                    size={25}
                    colour={item.iconColour || colour} 
                    icon={item.icon} onPress={item.iconAction}
                  />
                }
              </View>
            </TouchableNativeFeedback>
          </View>
        )
      } else if (item.disabled || Platform.OS == 'ios') {
        return (
          <View key={key} style={_style}>
            <TouchableOpacity 
              style={containerStyle} disabled={item.disabled}
              onPress={onPress}
            >
              <Text colour={colour}>{item.label}</Text>
              {
                item.icon &&
                <Icon
                  style={{width: 25}}
                  size={25}
                  colour={item.iconColour || colour} 
                  icon={item.icon} onPress={item.iconAction}
                />
              }
            </TouchableOpacity>
          </View>
        )
      }
    }

    return (
      <ScrollView style={[styles.f1, styles.col]}>
        {
          props.menu.map((item, i) => (
            menuItem(i, item)
          ))
        }
      </ScrollView>
    )
  }
}