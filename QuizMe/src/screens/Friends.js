import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import { Container, TabView, Modal, Form, SnackBar, Button, Input, Text } from '../components/Core';
import { checkSession, signOut } from '../actions/SessionActions';
import { colours, styles } from '../styles';
import { utils, api, validators } from '../utils';

const SecondRoute = () => (
  <View style={[styles.f1, { backgroundColor: '#ffffff' }]} />
);

class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      friends: null,
      addFriend: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      api.getFriends()
        .then(result => {
          this.setState({ 
            loading: false, 
            friends: result.friends,
            pending: result.pending,
            requests: result.requests,
          });
        })
        .catch(err => this.showError(err));
    })
  }

  showError(err) {
    this.setState({ loading: false });
    this.refs.error.show(err, 0);
  }

  openAddFriend = () => {
    this.setState({ addFriend: true });
  }

  cancel = () => {
    this.setState({ addFriend: false });
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

    let Friends = () => {
      if (!state.friends || state.friends.length == 0) {
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
        return (<View><Text>TODO: Build UI for Friends</Text></View>)
      }
    }

    let Requests = () => {
      if (!state.requests || state.requests.length == 0) {
        return (
          <View style={[styles.f1, styles.center, { padding: 30 }]}>
            <Text bold={true} align="center">You have no oustanding friend requests.</Text>
          </View>
        )
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
              onSuccess={values => {console.log("HEERE")}}
              disabled={state.loading || (!props.session.online)}
              inputWidth={250} btnWidth={100} divider={false}
            />
          </View>
        </Modal>
        <TabView
          scenes={{
            'Friends': Friends,
            'Requests': Requests,
          }}
        />
        <SnackBar ref="error" error={true} />
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
