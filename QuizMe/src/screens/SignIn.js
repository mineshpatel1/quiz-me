import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';
import Biometrics from 'react-native-biometrics';

import { Container, Text, Button, Form, SnackBar } from '../components/Core';
import { setSession } from '../actions/SessionActions';
import { styles } from '../styles';
import { utils, api, validators } from '../utils';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: false,
      pushToken: null,
      email: {
        value: null,
        valid: false,
      },
    };
  }

  componentDidMount() {
    utils.getPushToken()
      .then(pushToken => this.setState({ pushToken: pushToken }))
      .catch(err => console.error(err));
  }

  showError = err => {
    this.setState({ loading: false });
    this.refs.error.show(err, 0);
  }

  signIn = values => {
    this.setState({ loading: true }, () => {
      values.pushToken = this.state.pushToken;
      api.signIn(values)
        .then(res => {
          this.props.setSession(res);
          this.setState({ loading: false });
          this.props.navigation.navigate('Home');
        })
        .catch(this.showError);
    });
  }

  googleSignIn = () => {
    utils.googleSignIn()
      .then(info => {
        this.setState({ loading: true }, () => {
          api.verifyGoogleToken(
            info.user, info.idToken, this.state.pushToken
          ).then(res => {
            this.props.setSession(res);
            this.setState({ loading: false });
            this.props.navigation.navigate('Home');
          }).catch(this.showError);
        });
      })
      .catch(this.showError);
  }

  forgottenPassword = () => {
    let email = this.state.email.value;
    this.setState({ loading: true }, () => {
      api.forgottenPassword(email)
        .then(res => {
          this.props.setSession(res);
          this.setState({ loading: false });
          this.refs.forgotten.show("Password reset token sent to " + email, 0);
        })
        .catch(this.showError);
    });
  }

  verifyFingerprint = () => {
    let payload = { id: this.props.fingerprint, timestamp: utils.now(), random: Math.random() };
    Biometrics.createSignature('Verify fingerprint', JSON.stringify(payload))
      .then(signature => {
        this.setState({ loading: true }, () => {
          api.verifyFingerprint(payload, signature, this.state.pushToken)
            .then(res => {
              this.props.setSession(res);
              this.setState({ loading: false });
              this.props.navigation.navigate('Home');
            })
            .catch(this.showError);
        });
      })
      .catch(this.showError);
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
          <View style={[styles.center, styles.mt15]}>
            <Button label="Sign in with Google" icon="google" onPress={() => { 
              this.googleSignIn();
            }} />
            <Text display={true} style={styles.mt15}> Or </Text>
          </View>
          <Form
            fields={fields} successIcon={'sign-in-alt'}
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
        <SnackBar ref="error" error={true} />
        <SnackBar ref="forgotten" success={true} actionText="OK" />
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
  bindActionCreators({ setSession }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
