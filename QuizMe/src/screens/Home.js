import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Animated, TouchableOpacity, View, Image } from 'react-native';

import { Container, Text, Button, Icon, Modal, SnackBar } from '../components/Core';
import { checkSession, signOut } from '../actions/SessionActions';
import { colours, styles } from '../styles';
import { utils, api } from '../utils';

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

  componentWillMount() {
    utils.animate(this.state.opacity, 1);  // Fade in
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

    return (
      <Container 
        bgColour={colours.primary} style={[styles.center]}
        onConnectionChange={(info, online) => this.connectionChange(online)}
      >
        <Modal
          theme={true} isVisible={this.state.modal} onCancel={() => this.setState({ modal: false})}
          style={[styles.center]}
        >
          <View>
            <Button
              width={240} label="Settings" icon="cog" style={styles.mt15}
              onPress={() => this.navigate('Settings')}
            />
            {
              !props.session.user &&
              <Button
                width={240} label="Sign In" icon="sign-in-alt" style={styles.mt15}
                onPress={() => this.navigate('SignIn')}
              />
            }
            {
              props.session.user && 
              <Button
                width={240} label="Edit Profile" icon="user" style={styles.mt15}
                onPress={() => console.log('Edit Profile')}
              />
            }
            {
              props.session.user &&
              <Button
                width={240} label="Sign Out" icon="sign-out-alt" style={styles.mt15}
                onPress={() => {
                  props.signOut();
                  this.setState({ modal: false });
                }}
              />
            }
          </View>
        </Modal>
        <Animated.View style={{opacity: state.opacity}}>
          <View style={[styles.row, {height: 35, justifyContent: 'flex-end', paddingRight: 10}]}>
            <View style={[styles.aCenter, styles.row, {
              height: 35, marginLeft: 10, marginTop: 15, marginRight: 10,
            }]}>
              <View style={{ 
                backgroundColor: statusColour, height: 15, width: 15, borderRadius: 15,
                borderColor: colours.light, borderWidth: 2,
              }} />
            </View>
            <TouchableOpacity 
              style={[styles.center, {height: 35, width: 26, marginTop: 15}]} activeOpacity={0.75} 
              onPress={() => this.setState({ modal: true })}
            >
              <Icon size={26} icon="cog" colour={colours.white}/>
            </TouchableOpacity>
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
                } else {
                  props.navigation.navigate('SignIn');
                }
              }}
            />
          </View>
        </Animated.View>
        <SnackBar ref="error" error={true} />
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
