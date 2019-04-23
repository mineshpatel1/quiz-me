import React, { Component } from 'react';
import { View } from 'react-native';

import { Container, Header, Text, Button, Form, SnackBar } from '../components/Core';
import { colours, styles } from '../styles';
import { utils, validators } from '../utils';

export default class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  post(values) {
    this.setState({ loading: true }, () => {
      fetch('http://10.0.2.2:3000/user/new', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'x@gmail.com',
        }),
      })
      .then((res) => res.json())
      .then((res) => {
        if (res.hasOwnProperty('error')) {
          this.showError(res.error);
        } else {
          this.setState({ loading: false });
          console.log('Done', res);
        }
      })
      .catch((error) => {
        this.showError(error.toString());
      });
    });
  }

  showError(err) {
    this.setState({ loading: false });
    this.refs.error.show(err, 0);
  }

  render() {
    let { props, state } = this;
    let create = props.navigation.getParam('create', false);

    let title = 'Edit Profile';
    if (create) title = 'Sign Up';

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
      nickname: {
        label: "Nickname",
        icon: "user",
        type: "string",
        inputType: "text",
        validator: (val) => { return validators.isAlphaNumeric(val)},
      }
    }

    let values = {
      category: 'Science',
      numQuestions: 5,
      username: null,
    }

    return (
      <Container spinner={state.loading}>
        <Header title={title} route={'Home'} />
        <View style={[styles.f1, styles.col, styles.aCenter]}>
          <Form 
            fields={fields} values={values}
            onCancel={() => { this.props.navigation.goBack() }}
            onSuccess={values => {this.post(values)}}
            disabled={state.loading}
          />
        </View>
        <SnackBar ref="error" error={true} onAction={() => {
          this.setState({loading: false})
        }} />
      </Container>
    )
  }
}