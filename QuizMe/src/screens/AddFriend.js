import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';

import { Container, Form, SnackBar } from '../components/Core';
import { setSession } from '../actions/SessionActions';
import { styles } from '../styles';
import { validators, api } from '../utils';

class AddFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  showError = err => {
    this.setState({ loading: false });
    this.refs.error.show(err, 0);
  }

  showSuccess = msg => {
    this.setState({ loading: false });
    this.refs.success.show(msg, 2000);
  }

  addFriend = email => {
    this.setState({ addFriend: false, loading: true }, () => {
      api.friendRequests([email])
        .then(() => this.showSuccess("Sent friend request to " + email))
        .catch(this.showError);
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
    }

    return (
      <Container 
        spinner={state.loading} header="Add Friend"
      >
        <View style={[styles.f1, styles.col, styles.aCenter]}>
          <Form 
            fields={fields}
            onCancel={() => { this.props.navigation.goBack() }}
            onSuccess={values => this.addFriend(values.email)}
            disabled={state.loading || (!props.session.online)}
          />
        </View>
        <SnackBar ref="error" error={true} />
        <SnackBar 
          ref="success" success={true} 
          onAction={() => this.props.navigation.goBack()}
          onAutoHide={() => this.props.navigation.goBack()}
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
  bindActionCreators({}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(AddFriend);
