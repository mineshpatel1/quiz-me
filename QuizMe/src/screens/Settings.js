import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { signOut, deleteAccount } from '../actions/SessionActions';
import { Container, Header, Menu, Text, Modal, ConfirmModal } from '../components/Core';
import { styles } from '../styles';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
    }
  }

  cancelDelete() {
    this.setState({ deleteModal: false });
  }

  render() {
    let { props, state } = this;

    let menu = [
      { label: 'Account Settings', icon: 'user', onPress: () => { console.log('user settings'); }, disabled: (props.session.user ? false : true) },
      { label: 'Game Settings', icon: 'cog', onPress: () => { props.navigation.navigate('GameSettings'); }},
    ]

    if (props.session.user) {
      menu.push({label: 'Sign Out', icon: 'sign-out-alt', onPress: () => props.signOut() });
      menu.push({label: 'Delete Account', icon: 'times', onPress: () => { this.setState({deleteModal: true}) } });
    } else {
      menu.push({label: 'Sign In', icon: 'sign-in-alt', onPress: () => { props.navigation.navigate('SignIn'); } })
    }

    return (
      <Container>
        <Header title={'Settings'} route={'Home'} />
        <ConfirmModal 
          isVisible={state.deleteModal}
          onSuccess={() => { props.deleteAccount(); this.setState({deleteModal: false}); }}
          onCancel={() => this.cancelDelete()}
          message={
            "Deleting your account will remove all data forever.\n\nAre you sure you want to delete your account?"
          }
        />
        <Menu menu={menu} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return { session: state.session }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    signOut, deleteAccount,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
