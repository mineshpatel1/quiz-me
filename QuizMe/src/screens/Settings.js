import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { signOut } from '../actions/SessionActions';
import { Container, Header, Menu } from '../components/Core';

class Settings extends Component {
  render() {
    let { props, state } = this;

    let menu = [
      { label: 'Account Settings', icon: 'user', onPress: () => { console.log('user settings'); }, disabled: (props.session.user ? false : true) },
      { label: 'Game Settings', icon: 'cog', onPress: () => { props.navigation.navigate('GameSettings'); }},
    ]

    if (props.session.user) {
      menu.push({label: 'Sign Out', icon: 'sign-out-alt', onPress: () => props.signOut() });
    } else {
      menu.push({label: 'Sign In', icon: 'sign-in-alt', onPress: () => { props.navigation.navigate('SignIn'); } })
    }

    return (
      <Container>
        <Header title={'Settings'} route={'Home'} />
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
