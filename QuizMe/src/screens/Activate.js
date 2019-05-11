import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Platform, ScrollView, View } from 'react-native';
import launchMailApp from "react-native-mail-launcher";

import { Container, Text, Button, Input } from '../components/Core';
import { setSession } from '../actions/SessionActions';
import { styles, colours } from '../styles';
import { validators, api } from '../utils';

export default class Activate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      token: null,
      valid: false,
    }
  }
  
  render() {
    let { props, state } = this;
    return (
      <Container bgColour={colours.primary} iosAdjust={true} spinner={state.loading}>
        <View style={[styles.f1]}>
          <ScrollView 
            contentContainerStyle={[styles.aCenter, styles.f1]}
          >
            <View style={[styles.f1, { padding: 20 }]}>
              <Text size={24} colour={colours.white} align="center">{
                `An activation link has been sent to your email.\n\nYou won't be able to login until you have activated your account.\n\nP.S. Remember to check your spam.`
              }</Text>
            </View>
            <View style={[styles.f1, { padding: 20, paddingTop: 40}]}>
              {
                Platform.OS == 'android' && 
                <Button
                label="Check Mail" icon="envelope"
                onPress={() => { launchMailApp(); }} />
              }
              <Button
                label="Resend Link" icon="link" style={[styles.mt15]}
                onPress={() => { console.log('Link') }}
              />
              <Input
                label={'Token'} style={[styles.mt15]} icon={'hashtag'}
                value={this.state.token} type={'string'} ref="token"
                colour={colours.success}
                validator={(val) => {
                  if (!val) return false;
                  return val.length == 10 && validators.isAlphaNumeric(val);
                }}
                onChange={(val, valid) => {this.setState({ token: val, valid: valid })}}
              />
              <Button
                label="Activate" icon="check" style={[styles.mt15]}
                onPress={() => { console.log(state.token) }}
                disabled={!state.valid}
              />
            </View>
          </ScrollView>
        </View>
        <SnackBar ref="error" error={true} onAction={() => this.setState({loading: false})} />
        <SnackBar 
          ref="success" success={true} 
          onAction={() => this.props.navigation.navigate('Home')}
          onAutoHide={() => this.props.navigation.navigate('Home')}
        />
      </Container>
    )
  }
}