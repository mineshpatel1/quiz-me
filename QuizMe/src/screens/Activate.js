import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';
// import { openInbox } from 'react-native-email-link'

import { Container, Text, Button } from '../components/Core';
import { setUser } from '../actions/SessionActions';
import { styles, colours } from '../styles';
import { validators, api } from '../utils';

export default class Activate extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let { props } = this;
    return (
      <Container bgColour={colours.primary}>
        <View style={[styles.f1, styles.center, { padding: 20 }]}>
          <Text size={24} colour={colours.white} align="center">{
            `An activation link has been sent to your email.\n\nYou won't be able to login until you have activated your account within the next 48 hours (and then you'll have to sign up again).\n\nP.S. Remember to check your spam.`
          }</Text>
        </View>
        <View style={[styles.f1, styles.center, { padding: 20 }]}>
          <Button
            label="Check Mail" icon="envelope"
            onPress={() => {  }}
          />
          <Button
            label="Resend Link" icon="link" style={[styles.mt15]}
            onPress={() => { console.log('Link') }}
          />
          <Button
            label="Home" icon="home" style={[styles.mt15]}
            onPress={() => { props.navigation.navigate('Home') }}
          />
        </View>
      </Container>
    )
  }
}