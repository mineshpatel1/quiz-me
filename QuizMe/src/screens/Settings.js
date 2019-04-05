import React, { Component } from 'react';
import { View } from 'react-native';

import SettingsForm from '../components/SettingsForm';
import { Container, Header, Text, Button, Input } from '../components/Core';
import { styles, colours } from '../styles';
import { utils } from '../utils';

export default class Settings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { props, state } = this;
    return (
      <Container>
        <Header title={'Settings'} route={'Home'} />
        <View style={[styles.f1, styles.col, {alignItems: 'center'}]}>
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
