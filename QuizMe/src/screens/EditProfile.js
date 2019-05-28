import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';

import { Container, Form, SnackBar } from '../components/Core';
import { setSession } from '../actions/SessionActions';
import { styles } from '../styles';
import { validators, api } from '../utils';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: false,
    };
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
    this.setState({ loading: true });
    api.editUser(values)
      .then(res => {
        this.props.setSession(res);
        this.setState({ loading: false });
        this.props.navigation.navigate('Home');
      })
      .catch(err => this.showError(err));
  }

  render() {
    let { props, state } = this;

    let fields = {
      name: {
        label: "Nickname",
        icon: "user",
        type: "string",
        inputType: "text",
        validator: (val) => { return validators.isAlphaNumeric(val)},
      },
    }

    let values = {
      name: props.session.user.name,
    }

    return (
      <Container 
        spinner={state.loading} header="Edit Profile"
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

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
