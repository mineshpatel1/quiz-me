import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Platform, ScrollView, View, } from 'react-native';
import launchMailApp from "react-native-mail-launcher";

import { Container, Text, Button, Input, SnackBar } from '../components/Core';
import { setSession, checkSession } from '../actions/SessionActions';
import { styles, colours } from '../styles';
import { validators, api } from '../utils';

class Activate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      offline: false,
      loading: false,
      token: '123456789A',
      valid: false,
    }

    this.state.token = this.props.navigation.getParam('token');
    this.state.valid = this.validateToken(this.state.token);

    // Automatically attempt to activate if token is populated and valid
    if (this.state.token && this.state.valid) {
      this.state.loading = true;
      this.activate(this.state.token);
    }
  }

  resetToken() {
    if (!this.props.session.unconfirmed) {
      return this.showError("User is no longer in an unconfirmed state.");
    }

    this.setState({ loading: true}, () => {
      api.resetToken(this.props.session.unconfirmed.email)
        .then(_res => this.resendSuccess("Resent link and token."))
        .catch(err => this.showError(err));
    });
  }

  activate(token) {
    if (!this.props.session.unconfirmed) {
      return this.showError("User is no longer in an unconfirmed state.");
    }

    api.activate(this.props.session.unconfirmed.email, token)
        .then(res => {
          this.props.setSession(res);
          this.showSuccess("Activated account successfully.")
        })
        .catch(err => this.showError(err));
  }

  connectionChange(online) {
    if (online) this.props.checkSession();
    this.setState({ offline: !online, loading: false });
  }

  validateToken(val) {
    if (!val) return false;
    return val.length == 10 && validators.isAlphaNumeric(val);
  }

  showError(err) {
    this.setState({ loading: false });
    this.refs.error.show(err, 0);
  }

  showSuccess(msg) {
    this.setState({ loading: false });
    this.refs.success.show(msg, 1500);
  }

  resendSuccess(msg) {
    this.setState({ loading: false });
    this.refs.resend.show(msg);
  }
  
  render() {
    let { props, state } = this;
    return (
      <Container 
        bgColour={colours.primary} iosAdjust={true} spinner={state.loading}
        onConnectionChange={(_info, online) => this.connectionChange(online)}
      >
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
                onPress={() => this.resetToken()}
              />
              <Input
                label={'Token'} style={[styles.mt15]} icon={'hashtag'}
                value={this.state.token} type={'string'} ref="token"
                colour={colours.success}
                validator={this.validateToken}
                onChange={(val, valid) => {this.setState({ token: val, valid: valid })}}
              />
              <Button
                label="Activate" icon="check" style={[styles.mt15]}
                onPress={() => { this.setState({ loading: true }, () => {
                  this.activate(state.token);
                }) }}
                disabled={!state.valid || (state.offline || state.loading)}
              />
            </View>
          </ScrollView>
        </View>
        <SnackBar ref="error" error={true} onAction={() => this.setState({loading: false})} />
        <SnackBar ref="resend" success={true} onAction={() => this.setState({loading: false})} />
        <SnackBar
          ref="success" success={true} 
          onAction={() => this.props.navigation.navigate('Home')}
          onAutoHide={() => this.props.navigation.navigate('Home')}
        />
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    session: state.session,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setSession,
    checkSession,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Activate);
