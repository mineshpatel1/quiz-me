import React, { Component } from 'react';
import { View } from 'react-native';

import SettingsForm from '../components/SettingsForm';
import { Container, Header } from '../components/Core';
import { styles } from '../styles';

export default class GameSettings extends Component {
  render() {
    let { props } = this;
    return (
      <Container>
        <Header title={'Game Settings'} />
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
