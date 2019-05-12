import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';
import launchMailApp from "react-native-mail-launcher";

import { Container, Text, Button, Form, SnackBar } from '../components/Core';
import { setSession } from '../actions/SessionActions';
import { styles } from '../styles';
import { api, validators } from '../utils';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: false,
      offline: false,
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
        .then(() => {
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
        onConnectionChange={(_info, online) => {this.setState({ offline: !online, loading: false })}}
      >
        <View style={[styles.f1, styles.col, styles.aCenter]}>
          <View style={[styles.center, styles.mt15]}>
            <Button label="Register" icon="user-plus" onPress={() => { 
              props.navigation.navigate('Register');
            }} />
            <Text display={true} style={styles.mt15}> Or </Text>
          </View>
          <Form
            fields={fields} width={200} successIcon={'sign-in-alt'}
            onSuccess={values => {this.signIn(values)}} ref={'form'}
            disabled={state.loading || state.offline}
            onChange={(values, valid) => this.setState({ 
              email: {value: values.email, valid: valid.email} 
            })}
          >
            <Button
              label="Forgot Password" icon="question" onPress={() => this.forgottenPassword()} 
              style={styles.mt15} disabled={!state.email.valid}
            />
          </Form>
        </View>
        <SnackBar ref="error" error={true} onAction={() => {
          this.setState({loading: false})
        }} />
        <SnackBar 
          ref="forgotten" success={true} actionText="Check Mail"
          onAction={() => launchMailApp()}
        />
      </Container>
    );
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
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
