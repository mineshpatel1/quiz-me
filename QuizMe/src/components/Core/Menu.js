import React, { Component } from 'react';
import { Platform, ScrollView, View, TouchableOpacity, TouchableNativeFeedback } from 'react-native';

import Text from './Text';
import Icon from './Icon';
import { styles } from '../../styles';

export default class Menu extends Component {
  static defaultProps = {
    menu: null,
  }

  render() {
    let { props } = this;

    let menuItem = (key, label, icon, onPress) => {
      let _style = [
        styles.row, styles.aCenter, {
          height: 60, width: '100%', borderBottomWidth: 1, borderColor: '#CCC',
          justifyContent: 'space-between', paddingLeft: 15, paddingRight: 15,
        }
      ];

      if (Platform.OS == 'android') {
        return (
          <TouchableNativeFeedback key={key} onPress={onPress}>
            <View style={_style}>
              <Text>{label}</Text>
              <Icon icon={icon} />
            </View>
          </TouchableNativeFeedback>
        )
      } else if (Platform.OS == 'ios') {
        return (
          <TouchableOpacity key={key} style={_style}>
            <Text>{label}</Text>
            <Icon icon={icon} />
          </TouchableOpacity>
        )
      }
    }

    return (
      <ScrollView style={[styles.f1, styles.col]}>
        {
          props.menu.map((item, i) => (
            menuItem(i, item.label, item.icon, item.onPress)
          ))
        }
      </ScrollView>
    )
  }
}