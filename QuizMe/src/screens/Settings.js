import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';

import { signOut } from '../actions/SessionActions';
import { Container, Menu, Text } from '../components/Core';
import { colours, styles } from '../styles';

class Settings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { props, state } = this;

    let user = props.session.user;
    let menu = [
      { label: 'Account Settings', icon: 'user', onPress: () => { props.navigation.navigate('UserSettings'); }, disabled: (props.session.user ? false : true) },
      { label: 'Game Settings', icon: 'cog', onPress: () => { props.navigation.navigate('GameSettings'); }},
      { label: 'Question Summary', icon: 'question', onPress: () => { props.navigation.navigate('Questions'); }},
    ]

    if (props.session.user) {
      menu.push({label: 'Sign Out', icon: 'sign-out-alt', onPress: () => props.signOut() });
    } else if (props.session.resetPassword) {
      menu.push(
        { label: 'Reset Password', icon: 'lock', onPress: () => { props.navigation.navigate('ResetPassword'); }}
      );
    } else {
      menu.push({
        label: 'Sign In',  icon: 'sign-in-alt', 
        disabled: !props.session.online,
        
        onPress: () => { 
          if (props.session.unconfirmed) {
            props.navigation.navigate('Activate');
          } else {
            props.navigation.navigate('SignIn');
          }
        }
      })
    }

    return (
      <Container header="Settings">
        {
          user &&
          <View style={[styles.mt15, styles.pb15, styles.borderBottom]}>
            <Text bold={true} align="center">{user.name || user.email}</Text>
          </View>
        }
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
