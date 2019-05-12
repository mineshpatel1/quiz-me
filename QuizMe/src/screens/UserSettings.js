import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { signOut, deleteAccount } from '../actions/SessionActions';
import { Container, Menu, ConfirmModal } from '../components/Core';

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
      { label: 'Change Password', icon: 'lock', onPress: () => props.navigation.navigate('ResetPassword') },
      { label: 'Delete Account', icon: 'times', onPress: () => this.setState({deleteModal: true}) },
    ];

    return (
      <Container header="Settings">
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
    signOut,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
