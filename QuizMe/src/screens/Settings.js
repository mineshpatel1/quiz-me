import React, { Component } from 'react';
import { View } from 'react-native';

import { Container, Header, Text, Icon, Menu } from '../components/Core';
import { styles } from '../styles';

export default class GameSettings extends Component {
  render() {
    let { props, state } = this;

    let menu = [
      { label: 'Account Settings', icon: 'user', onPress: () => { console.log('user settings'); }},
      { label: 'Game Settings', icon: 'cog', onPress: () => { props.navigation.navigate('GameSettings'); }},
    ]

    return (
      <Container>
        <Header title={'Settings'} route={'Home'} />
        <Menu menu={menu} />
      </Container>
    );
  }
}