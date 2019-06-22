import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Animated, View, Image, Linking } from 'react-native';

import { Container, Button, IconSet } from '../components/Core';
import { checkSession, signOut } from '../actions/SessionActions';
import { colours, styles } from '../styles';
import { utils } from '../utils';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      online: false,
      loggedIn: false,
      modal: false,
      requestCount: null,
      init: false,
    }
  }

  componentDidMount() {
    utils.animate(this.state.opacity, 1);  // Fade in
    Linking.addEventListener('url', event => this.redirectUrl(event.url));  // IOS Deep Link
    Linking.getInitialURL().then(url => this.redirectUrl(url));  // Android Deep Link
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', event => this.redirectUrl(event.url));
  }

  checkSession(prop, callback) {
    this.props.checkSession()
      .then(session => {
        if (session && !session.user && session[prop]) callback();
      })
      .catch(err => console.error(err));
  }

  // Handle deep links
  redirectUrl(url) {
    if (url && url.startsWith('quizme://quizme/')) {
      url = url.replace('quizme://quizme/', '');

      if (url.startsWith('activate')) {
        this.checkSession('unconfirmed', () => {
          this.props.navigation.navigate('Activate', { token: url.replace('activate/', '') });
        });
      } else if (url.startsWith('resetPassword')) { 
        this.checkSession('resetPassword', () => {
          this.props.navigation.navigate('ResetPassword', { token: url.replace('resetPassword/', '') });
        });        
      }
    }
  }

  render() {
    let { props, state } = this;

    let requestCount = props.session.requests ? props.session.requests.length : null;
    let bottomLinks = [
      { icon: 'cog', nav: 'Settings' },
    ];

    if (props.session.online) {
      if (props.session.user) {
        bottomLinks.push({ icon: 'user-friends', nav: 'Friends', badge: requestCount });
      } else {
        bottomLinks.push({ 
          icon: 'sign-in-alt', 
          nav: props.session.unconfirmed ? 'Activate': 'SignIn'
        });
      }
    }

    return (
      <Container
        bgColour={colours.primary} style={[styles.center]}
      >
        <Animated.View style={[styles.f1, styles.col, {width: '100%', opacity: state.opacity}]}>
          <View style={[styles.f1, styles.row, styles.center, {paddingLeft: 10, paddingRight: 10}]}>
            <Image style={[styles.f1]} resizeMode="contain" source={require('../../assets/images/title.png')} />
          </View>
          <View style={[styles.f1, styles.center]}>
            <Button
              label="Single Player" icon="user" borderColour={colours.primaryDark}
              onPress={() => { props.navigation.navigate('NewGame', { mode: 'single' }) }}
            />
            <Button
              label="Head to Head" icon="user-friends" style={styles.mt15} disabled={!props.session.online}
              borderColour={colours.primaryDark} onPress={() => {
                if (props.session.user) {
                  props.navigation.navigate('NewGame', { mode: 'multi' });
                } else if (props.session.unconfirmed) {
                  props.navigation.navigate('Activate');
                } else {
                  props.navigation.navigate('SignIn');
                }
              }}
            />
            <Button 
              label="Test" icon="ankh" style={styles.mt15} borderColour={colours.primaryDark}
              onPress={() => {
                utils.getPushToken()
                  .then(val => {
                    console.log('my token', val);
                  })
                  .catch(err => {
                    console.log('Error', err);
                  })
              }}
            />
          </View>
          <IconSet borderColour={colours.primaryLight} links={bottomLinks} />
        </Animated.View>
      </Container>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
