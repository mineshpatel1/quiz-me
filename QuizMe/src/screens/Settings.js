import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';

import { Container, Menu, Text, SnackBar } from '../components/Core';
import { signOut } from '../actions/SessionActions';
import { styles } from '../styles';
import utils from '../utils/utils';

class Settings extends Component {
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

  signOut = () => {
    this.props.signOut()
      .then(() => this.setState({ loading: false }))
      .catch(this.showError);
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
      menu.push({label: 'Sign Out', icon: 'sign-out-alt', 
        onPress: () => {
          this.setState({ loading: true }, () => {
            if (props.session.googleId) {
              utils.googleSignOut()
                .then(() => this.signOut())
                .catch(this.showError);
            } else {
              this.signOut();
            }
          });
        }
      });
    } else if (props.session.resetPassword) {
      menu.push(
        { label: 'Reset Password', icon: 'lock', onPress: () => { props.navigation.navigate('ResetPassword', { mode: 'reset' }); }}
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
      <Container header="Settings" spinner={state.loading} >
        {
          user &&
          <View style={[styles.mt15, styles.pb15, styles.borderBottom]}>
            <Text bold={true} align="center">{user.name || user.email}</Text>
          </View>
        }
        <Menu menu={menu} />
        <SnackBar ref="error" error={true} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return { session: state.session }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ signOut }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
