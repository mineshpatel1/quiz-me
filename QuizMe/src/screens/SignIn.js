import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';

import { Container, Header, Text, Button, Form, SnackBar } from '../components/Core';
import { setStatus } from '../actions/SessionActions';
import { styles } from '../styles';
import { utils, validators } from '../utils';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: false,
      offline: false,
    };
  }

  showError(err) {
    this.setState({ loading: false });
    this.refs.error.show(err, 0);
  }

  signIn(values) {
    this.setState({ loading: true }, () => {
      utils.post('user/auth', values)
        .then((res) => {
          if (res.hasOwnProperty('error')) return this.showError(res.error);
          if (res.success) {
            this.props.setStatus(true);
            this.setState({ loading: false });
            return this.props.navigation.navigate('Home');
          }
          this.showError("Unexpected login failure.");
        })
        .catch((error) => {
          this.showError(error.toString());
        });
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
        spinner={state.loading}
        onConnectionChange={(info, online) => {this.setState({ offline: !online, loading: false })}}
      >
        <Header title={'Sign In'} route={'Home'} />
        <View style={[styles.f1, styles.col, styles.aCenter]}>
          <View style={[styles.center, styles.mt15]}>
            <Button label="Sign Up" icon="user-plus" onPress={() => { 
              props.navigation.navigate('EditUser', { create: true })
            }} />
            <Text display={true} style={styles.mt15}> Or </Text>
          </View>
          <Form 
            fields={fields}
            onCancel={() => { this.props.navigation.goBack() }}
            onSuccess={values => {this.signIn(values)}}
            disabled={state.loading || state.offline}
          />
        </View>
        <SnackBar ref="error" error={true} onAction={() => {
          this.setState({loading: false})
        }} />
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
    setStatus,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
