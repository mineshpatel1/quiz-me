import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Platform, Animated, View, Image, Linking } from 'react-native';

import { Container, Button, Icon } from '../components/Core';
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

  connectionChange(online) {
    if (online) this.props.checkSession().catch(err => console.log('Session check error: ', err));
  }

  render() {
    let { props, state } = this;
    let statusColour = props.session.user ? colours.success : colours.error;
    let iosAdjust = Platform.OS == 'ios' ? 15: 0;

    let bottomLinks = [
      { icon: 'cog', link: 'Settings', margin: 0 },
      { icon: 'user-friends', link: props.session.user ? 'Friends' : 'SignIn' },
    ]

    return (
      <Container
        bgColour={colours.primary} style={[styles.center]}
        onConnectionChange={(_info, online) => this.connectionChange(online)}
      >
        <Animated.View style={[styles.f1, styles.col, {width: '100%', opacity: state.opacity}]}>
          <View style={[styles.f1, styles.row, styles.center, {paddingLeft: 10, paddingRight: 10}]}>
            <Image style={[styles.f1]} resizeMode="contain" source={require('../../assets/images/title.png')} />
          </View>
          <View style={[styles.f1, styles.center]}>
            <Button
              label="Single Player" icon="user"
              onPress={() => { props.navigation.navigate('NewGame') }}
            />
            <Button
              label="Head to Head" icon="user-friends" style={styles.mt15} disabled={!props.session.online}
              onPress={() => {
                if (props.session.user) {
                  console.log("I am logged in!!!!");
                } else if (props.session.unconfirmed) {
                  props.navigation.navigate('Activate');
                } else {
                  props.navigation.navigate('SignIn');
                }
              }}
            />
          </View>
          <View style={[styles.row, styles.center, { 
            height: 50 + iosAdjust, borderTopWidth: 1, paddingBottom: iosAdjust,
            borderColor: colours.primaryLight,
          }]}>
            {
              bottomLinks.map((link, i) => (
                <Icon
                  key={i} onPress={() => props.navigation.navigate(link.link)}
                  size={26} icon={link.icon} colour={colours.white}
                  style={{ marginLeft: link.margin || 15 }}
                />
              ))
            }
          </View>
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
