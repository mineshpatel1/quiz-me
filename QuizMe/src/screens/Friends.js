import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Contacts from 'react-native-contacts';

import { 
  Container, TabView, ConfirmModal, Modal, Form, SnackBar, Menu, 
  MultiPickerModal, IconSet, Text,
} from '../components/Core';
import { setSession } from '../actions/SessionActions';
import { colours, styles } from '../styles';
import { utils, api, validators } from '../utils';

class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      init: false,
      friends: [],
      requests: [],
      emails: [],
      contactModal: false,
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
          this.props.setSession({
            user: this.props.session.user,
            friends: result.friends,
            requests: result.requests,
          });
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
    this.refs.success.show(msg, 2000);
  }

  addFriend = email => {
    this.setState({ addFriend: false, loading: true }, () => {
      api.friendRequests([email])
        .then(() => this.showSuccess("Sent friend request to " + email))
        .catch(this.showError);
    });
  }

  requestFriends = emails => {
    this.setState({ contactModal: false, loading: true }, () => {
      api.friendRequests(emails)
        .then(() => this.showSuccess("Sent " + emails.length + " friend requests."))
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

  syncContacts = () => {
    this.setState({ loading: true }, () => {
      utils.getPermission('READ_CONTACTS', 'QuizMe wants to find other players from your contacts.')
        .then(() => {
          Contacts.getAll((err, contacts) => {
            if (err) {
              if (err == 'denied') err = 'Read Contacts permission denied.' // For iOS
              return this.showError(err);
            }
            
            let emails = [];
            contacts.forEach(contact => {
              contact.emailAddresses.forEach(email => {
                emails.push(email.email);
              });
            });
            emails = utils.unique(emails);  // Unique

            api.getPossibleFriends(emails)
              .then(result => {
                let users = result.users;
                if (users.length == 0) return this.showError("None of your friends play QuizMe");
                emails = users.map(u => u.email);
                this.refs.contactList.update(utils.clone(emails));
                this.setState({ loading: false, emails: emails, contactModal: true });
              })
              .catch(this.showError);
          })
        }).catch(this.showError);
    });
  }

  render() {
    let { props, state } = this;

    let requests = [];
    if (props.session.requests) {
      props.session.requests.forEach((req) => {
        requests.push({ 
          label: req.name || req.email, subLabel: req.name ? req.email : null,
          onPress: () => { this.setState({ confirmFriend: req.id }) }
        });
      });
    }
    
    let friends = [];
    if (props.session.friends) {
      props.session.friends.forEach((friend) => {
        friends.push({
          label: friend.name || friend.email, subLabel: friend.name ? friend.email : null,
          iconColour: colours.error, icon: 'times', iconAction: () => { this.setState({ unfriend: friend.id }) },
        });
      });
    }

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
      return (
        <View style={[styles.f1]}>
          {
            state.init && friends.length == 0 &&
            <Text style={{padding: 30}} bold={true} align="center">
              { "Aww, it seems you don't have any friends." }
            </Text>
          }
          <Menu menu={friends} />
          <IconSet links={[
            { icon: "sync-alt", onPress: () => this.fetchFriends() },
            { icon: "user-plus", onPress: () => this.openAddFriend() },
            { icon: "address-book", onPress: () => this.syncContacts() }
          ]} />
        </View>
      )
    }

    let Requests = () => {
      return (
        <View style={[styles.f1]}>
          {
            state.init && requests.length == 0 &&
            <Text style={{padding: 30}} bold={true} align="center">
              { "You have no oustanding friend requests." }
            </Text>
          }
          <Menu menu={requests} />
          <IconSet links={[
            { icon: "sync-alt", onPress: () => this.fetchFriends() },
          ]} />
        </View>
      )
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
              width={300} inputWidth={250} btnWidth={100} divider={false}
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
        <MultiPickerModal
          isVisible={this.state.contactModal} options={state.emails}
          onSuccess={values => { this.requestFriends(values) }}
          onCancel={() => this.setState({ contactModal: false })}
          fontSize={14} bold={false} padding={5}
          ref="contactList"
        />
        <TabView
          scenes={{ 'Friends': Friends, 'Requests': Requests }}
          badges={{ 'Requests': requests.length }}
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
  bindActionCreators({ setSession }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Friends);
