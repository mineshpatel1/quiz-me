import React, { Component } from 'react';
import { View, Image } from 'react-native';

import { Container, Text, Icon, Button } from '../components/Core';
import { colours, styles } from '../styles';

export default class Home extends Component {
  render() {
    let { props } = this;
    return (
      <Container bgColour={colours.primary} style={[styles.center]}>
        <View style={[styles.f1, {justifyContent: 'flex-end', alignItems: 'center'}]}>
          <Image style={{width: 400, height: 150}} source={require('../../assets/images/title.png')} />
        </View>

        <View style={[styles.f1, styles.center]}>
          <Button
            label="New Game" icon="play"
            onPress={() => { props.navigation.navigate('NewGame') }}
          />
          <Button
            label="Questions" icon="question" style={styles.mt15}
            onPress={() => { props.navigation.navigate('Questions') }}
          />
          <Button
            label="Settings" icon="cog" style={styles.mt15}
            onPress={() => { props.navigation.navigate('Settings') }}
          />
        </View>
      </Container>

    );
  }
}
