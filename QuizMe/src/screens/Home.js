import React, { Component } from 'react';
import { Animated, View, Image } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

import { Container, Button } from '../components/Core';
import { colours, styles } from '../styles';
import { utils } from '../utils';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      online: false,
    }
  }

  componentWillMount() {
    utils.animate(this.state.opacity, 1);  // Fade in
  }

  render() {
    let { props, state } = this;
    return (
      <Container 
        bgColour={colours.primary} style={[styles.center]}
        onConnectionChange={(info, online) => {this.setState({ online: online })}}
      >
        <Animated.View style={{opacity: state.opacity}}>
          <View style={[styles.f1, {justifyContent: 'flex-end', alignItems: 'center'}]}>
            <Image style={{width: 400, height: 150}} source={require('../../assets/images/title.png')} />
          </View>

          <View style={[styles.f1, styles.center]}>
            <Button
              label="Single Player" icon="play"
              onPress={() => { props.navigation.navigate('NewGame') }}
            />
            <Button
              label="Settings" icon="cog" style={styles.mt15}
              onPress={() => { props.navigation.navigate('Settings') }}
            />
            <Button
              label="Sign Up" icon="user-plus" style={styles.mt15} disabled={!state.online}
              onPress={() => { props.navigation.navigate('EditUser', {create: true}) }}
            />
          </View>
        </Animated.View>
      </Container>

    );
  }
}
