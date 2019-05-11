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
    Linking.addEventListener('url', this.handleOpenURL);
    Linking.getInitialURL().then(url => {  // Android Deep Link
      console.log('InitialURL', url);
    });
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL(event) {  // IOS Deep Link
    console.log('Handle', event.url);
  }

  connectionChange(online) {
    if (online) this.props.checkSession();
    this.setState({ online: online })
  }

  navigate(page) {
    this.setState({ modal: false });
    this.props.navigation.navigate(page);
  }

  render() {
    let { props, state } = this;
    let statusColour = props.session.user ? colours.success : colours.error;
    let iosAdjust = Platform.OS == 'ios' ? 25 : 0;
    let iosRightAdjust = Platform.OS == 'ios' ? 25 : 10;

    return (
      <Container
        bgColour={colours.primary} style={[styles.center]}
        onConnectionChange={(info, online) => this.connectionChange(online)}
      >
        <Animated.View style={{opacity: state.opacity}}>
          <View style={[styles.row, {
            height: 35, alignItems: 'center', justifyContent: 'flex-end', 
            marginRight: iosRightAdjust, marginTop: iosAdjust,
          }]}>
            <View style={[styles.aCenter, styles.row, {
              height: 35, marginLeft: 10, marginTop: 15, marginRight: 10,
            }]}>
              <View style={{
                backgroundColor: statusColour, height: 15, width: 15, borderRadius: 15,
                borderColor: colours.light, borderWidth: 2,
              }} />
            </View>
            <Icon
              style={[styles.center, {height: 35, width: 26, marginTop: 15}]}  
              onPress={() => props.navigation.navigate('Settings')}
              size={26} icon="cog" colour={colours.white}
            />
          </View>
          <View style={[styles.f1, {justifyContent: 'flex-end', alignItems: 'center'}]}>
            <Image style={{width: 400, height: 150}} source={require('../../assets/images/title.png')} />
          </View>

          <View style={[styles.f1, styles.center]}>
            <Button
              label="Single Player" icon="user"
              onPress={() => { props.navigation.navigate('NewGame') }}
            />
            <Button
              label="Head to Head" icon="user-friends" style={styles.mt15} disabled={!state.online}
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
