import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';
import Biometrics from 'react-native-biometrics';

import { Container, Text, Button, Form, SnackBar, Icon } from '../components/Core';
import { setSession } from '../actions/SessionActions';
import { styles } from '../styles';
import { utils, api, validators } from '../utils';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: false,
      email: {
        value: null,
        valid: false,
      },
    };
  }

  showError(err) {
    this.setState({ loading: false });
    this.refs.error.show(err, 0);
  }

  signIn(values) {
    this.setState({ loading: true }, () => {
      api.signIn(values)
        .then(res => {
          this.props.setSession(res);
          this.setState({ loading: false });
          this.props.navigation.navigate('Home');
        })
        .catch(err => this.showError(err));
    });
  }

  forgottenPassword() {
    let email = this.state.email.value;
    this.setState({ loading: true }, () => {
      api.forgottenPassword(email)
        .then(res => {
          this.props.setSession(res);
          this.setState({ loading: false });
          this.refs.forgotten.show("Password reset token sent to " + email, 0);
        })
        .catch(err => this.showError(err));
    });
  }

  verifyFingerprint() {
    let payload = { id: this.props.fingerprint, timestamp: utils.now(), random: Math.random() };
    Biometrics.createSignature('Verify fingerprint', JSON.stringify(payload))
        .then(signature => {
          this.setState({ loading: true }, () => {
            api.verifyFingerprint(payload, signature)
              .then(res => {
                this.props.setSession(res);
                this.setState({ loading: false });
                this.props.navigation.navigate('Home');
              })
              .catch(err => this.showError(err));
          });
        })
        .catch(err => this.showError(err));
  }

  render() {
    let { props, state } = this;

    let fields = {
      email: {
        label: "Email",
        icon: "envelope",
        type: "string",
        inputType: "text",
        validator: (val) => {return val && validators.isEmail(val)},
        format: (val) => { return val.toLowerCase() },
      },
      password: {
        label: "Password",
        icon: "lock",
        type: "string",
        inputType: "text",
        secure: true,
        validator: (val) => {
          if (!val) return false;
          return !validators.hasSpace(val);
        },
      },
    }

    return (
      <Container
        spinner={state.loading} header={'Sign In'}
        onConnectionChange={() => {this.setState({ loading: false })}}
      >
        <View style={[styles.f1, styles.col, styles.aCenter]}>
          <View style={[styles.center, styles.mt15]}>
            <Button label="Register" icon="user-plus" onPress={() => { 
              props.navigation.navigate('Register');
            }} />
            <Text display={true} style={styles.mt15}> Or </Text>
          </View>
          {
            props.fingerprint &&
            <View style={[styles.center, styles.mt15]}>
              <Button label="Use Fingerprint" icon="fingerprint" onPress={() => { 
                this.verifyFingerprint();
              }} />
              <Text display={true} style={styles.mt15}> Or </Text>
            </View>
          }
          <Form
            fields={fields} width={200} successIcon={'sign-in-alt'}
            onSuccess={values => {this.signIn(values)}} ref={'form'}
            disabled={state.loading || (!props.session.online)}
            onChange={(values, valid) => this.setState({ 
              email: {value: values.email, valid: valid.email} 
            })}
          >
            <Button
              label="Forgot Password" icon="question" onPress={() => this.forgottenPassword()} 
              style={styles.mt15} disabled={!state.email.valid || !props.session.online}
            />
          </Form>
        </View>
        <SnackBar ref="error" error={true} onAction={() => {
          this.setState({loading: false})
        }} />
        <SnackBar 
          ref="forgotten" success={true} actionText="OK"
          onAction={() => {}}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    session: state.session,
    fingerprint: state.settings.user.fingerprint,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setSession,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
