import React, { Component } from 'react';
import { View } from 'react-native';

import SettingsForm from '../components/SettingsForm';
import { Container, Header, Text, Button, Input } from '../components/Core';
import { styles, colours } from '../styles';
import { utils } from '../utils';

export default class Settings extends Component {
  render() {
    let { props, state } = this;
    return (
      <Container>
        <Header title={'Default Settings'} route={'Home'} />
        <View style={[styles.f1, styles.col, styles.aCenter]}>
          <SettingsForm
            onSave={() => { props.navigation.goBack(); }}
            onCancel={() => { props.navigation.goBack(); }}
            save={true}
          />
        </View>
      </Container>
    )
  }
}
