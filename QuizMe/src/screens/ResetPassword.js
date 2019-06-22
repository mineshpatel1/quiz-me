import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';

import { Container, Form, SnackBar } from '../components/Core';
import { setSession } from '../actions/SessionActions';
import { styles } from '../styles';
import { validators, api } from '../utils';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: false,
      token: '123456789A',
      valid: false,
    };

    this.state.token = this.props.navigation.getParam('token');
    this.state.valid = this.validateToken(this.state.token);
  }

  showError = err => {
    this.setState({ loading: false });
    this.refs.error.show(err, 0);
  }

  showSuccess = msg => {
    this.setState({ loading: false });
    this.refs.success.show(msg, 1500);
  }

  post = values => {
    if (this.props.session.resetPassword) {
      api.resetPassword(
        this.props.session.resetPassword.email,
        values.token,
        values.password,
      )
      .then(res => {
        this.props.setSession(res);
        this.showSuccess('Reset password successfully.');
      })
      .catch(err => this.showError(err));
    } else if (this.props.session.user) {
      api.changePassword(values.password)
        .then(() => this.showSuccess('Changed password successfully.'))
        .catch(err => this.showError(err));
    }
  }

  validateToken = (val) => {
    if (!val) return false;
    return val.length == 10 && validators.isAlphaNumeric(val);
  }

  render() {
    let { props, state } = this;

    let fields = {
      token: {
        label: "Token",
        icon: "hashtag",
        type: "string",
        inputType: "text",
        validator: this.validateToken,
      },
      password: {
        label: "New Password",
        icon: "lock",
        type: "string",
        inputType: "text",
        secure: true,
        validator: (val) => {
          if (!val) return false;
          return (
            validators.hasLower(val) && validators.hasUpper(val) &&
            validators.hasNumeric(val) && !validators.hasSpace(val)
          )
        },
      },
      confirmPassword: {
        label: "Confirm Password",
        icon: "lock",
        type: "string",
        inputType: "text",
        secure: true,
        validator: (val, formVals) => {return val && val == formVals.password},
      },
    }

    let values = {
      token: state.token,
    }

    return (
      <Container 
        spinner={state.loading} header="Reset Password"
      >
        <View style={[styles.f1, styles.col, styles.aCenter]}>
          <Form 
            fields={fields} values={values}
            onCancel={() => { this.props.navigation.navigate('Home') }}
            onSuccess={values => {this.post(values)}}
            disabled={state.loading || (!props.session.online)}
          />
        </View>
        <SnackBar ref="error" error={true} onAction={() => {
          this.setState({loading: false});
        }} />
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
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
