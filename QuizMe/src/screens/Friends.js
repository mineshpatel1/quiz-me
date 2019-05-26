import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Container, TabView, ConfirmModal, Modal, Form, SnackBar, Menu, Button, Text } from '../components/Core';
import { checkSession, signOut } from '../actions/SessionActions';
import { colours, styles } from '../styles';
import { api, validators } from '../utils';

class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      init: false,
      friends: [],
      requests: [],
      addFriend: false,
      confirmFriend: false,
      unfriend: false,
    };
  }

  componentDidMount() {
    this.fetchFriends();
  }

  fetchFriends = () => {
    this.setState({ loading: true }, () => {
      api.getFriends()
        .then(result => {
          this.setState({ 
            loading: false, init: true,
            friends: result.friends,
            requests: result.requests,
          });
        })
        .catch(err => this.showError(err));
    });
  }

  showError = err => {
    this.setState({ loading: false });
    this.refs.error.show(err, 0);
  }

  showSuccess = msg => {
    this.setState({ loading: false });
    this.refs.success.show(msg, 3);
  }

  addFriend = email => {
    this.setState({ addFriend: false, loading: true }, () => {
      api.friendRequest(email)
        .then(() => this.showSuccess("Sent friend request."))
        .catch(this.showError);
    });
  }

  confirmFriend = id => {
    this.setState({ confirmFriend: false, loading: true }, () => {
      api.confirmFriend(id)
        .then(() => this.fetchFriends())
        .catch(this.showError);
    });
  }

  unfriend = id => {
    this.setState({ 
      confirmFriend: false, 
      unfriend: false, 
      loading: true
    }, () => {
      api.unfriend(id)
        .then(() => this.fetchFriends())
        .catch(this.showError);
    });
  }

  openAddFriend = () => {
    this.setState({ addFriend: true });
  }

  cancel = () => {
    this.setState({ addFriend: false });
  }

  render() {
    let { props, state } = this;

    let requests = [];
    state.requests.forEach((req, i) => {
      requests.push({ 
        label: req.name || req.email, subLabel: req.name ? req.email : null,
        onPress: () => { this.setState({ confirmFriend: req.id }) }
      });
    });

    let friends = [];
    state.friends.forEach((friend, i) => {
      friends.push({
        label: friend.name || friend.email, subLabel: friend.name ? friend.email : null,
        iconColour: colours.error, icon: 'times', iconAction: () => { this.setState({ unfriend: friend.id }) },
      });
    });

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

    let Friends = () => {
      if (!state.init) {
        return (<View/>)
      } else if (!state.friends || state.friends.length == 0) {
        return (
          <View style={[styles.f1, styles.center, { padding: 30 }]}>
            <Text bold={true} align="center">Aww, it seems you don't have any friends.</Text>
            <Button 
              style={styles.mt15}
              btnColour={colours.success} 
              fontColour={colours.white} 
              label="Add Friend" icon="user-plus" 
              onPress={() => { this.openAddFriend() }} 
            />

            <Button 
              style={styles.mt15}
              btnColour={colours.success} 
              fontColour={colours.white} 
              label="Sync Contacts" icon="address-book" 
              onPress={() => { this.showError("Sync Contacts") }} 
            />
          </View>
        )
      } else {
        return (<Menu menu={friends} />)
      }
    }

    let Requests = () => {
      if (!state.requests || state.requests.length == 0) {
        return (
          <View style={[styles.f1, styles.center, { padding: 30 }]}>
            <Text bold={true} align="center">You have no oustanding friend requests.</Text>
          </View>
        )
      } else {
        return (<Menu menu={requests} />)
      }
    }

    return (
      <Container header="Friends" spinner={state.loading}>
        <Modal
          isVisible={this.state.addFriend} onCancel={this.cancel}
          style={[styles.center]} height={245}
        >
          <View>
            <Text align="center" bold={true}>Add Friend</Text>
            <Form 
              fields={fields}
              onCancel={this.cancel}
              onSuccess={values => this.addFriend(values.email)}
              disabled={state.loading || (!props.session.online)}
              inputWidth={250} btnWidth={100} divider={false}
            />
          </View>
        </Modal>
        <ConfirmModal 
          isVisible={this.state.confirmFriend > 0}
          message={"Confirm or reject friend request?"}
          onCancel={() => { this.setState({ confirmFriend: false }) }}
          onSuccess={() => { this.confirmFriend(state.confirmFriend); }}
          onReject={() => { this.unfriend(state.confirmFriend); }}
        />
        <ConfirmModal 
          isVisible={this.state.unfriend > 0}
          message={"Unfriend this player?"}
          onCancel={() => { this.setState({ unfriend: false }) }}
          onSuccess={() => { this.unfriend(state.unfriend); }}
        />
        <TabView
          scenes={{
            'Friends': Friends,
            'Requests': Requests,
          }}
        />
        <SnackBar ref="error" error={true} />
        <SnackBar ref="success" success={true} />
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
    checkSession, signOut,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Friends);
