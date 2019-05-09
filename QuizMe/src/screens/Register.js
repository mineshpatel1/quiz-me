import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';

import { Container, Header, Form, SnackBar } from '../components/Core';
import { setUser } from '../actions/SessionActions';
import { styles } from '../styles';
import { validators, api } from '../utils';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: false,
      offline: false,
    };
  }

  post(values) {
    this.setState({ loading: true }, () => {
      api.newUser(values)
        .then(res => {
          this.props.setUser(res.user);
          this.showSuccess("Signed Up Successfully.")
        })
        .catch(err => this.showError(err))
    });
  }

  showError(err) {
    this.setState({ loading: false });
    this.refs.error.show(err, 0);
  }

  showSuccess(msg) {
    this.setState({ loading: false });
    this.refs.success.show(msg, 1000);
  }

  render() {
    let { props, state } = this;
    let title = 'Register';
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
      name: {
        label: "Nickname",
        icon: "user",
        type: "string",
        inputType: "text",
        validator: (val) => { return validators.isAlphaNumeric(val)},
      }
    }

    return (
      <Container 
        spinner={state.loading}
        onConnectionChange={(info, online) => {this.setState({ offline: !online, loading: false })}}
      >
        <Header title={title} />
        <View style={[styles.f1, styles.col, styles.aCenter]}>
          <Form 
            fields={fields}
            onCancel={() => { this.props.navigation.goBack() }}
            onSuccess={values => {this.post(values)}}
            disabled={state.loading || state.offline}
          />
        </View>
        <SnackBar ref="error" error={true} onAction={() => {
          this.setState({loading: false})
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
    setUser,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Register);