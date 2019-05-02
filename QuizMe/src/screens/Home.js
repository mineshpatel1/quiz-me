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
    this.props.checkSession();
    utils.animate(this.state.opacity, 1);  // Fade in
  }

  render() {
    let { props, state } = this;

    return (
      <Container 
        bgColour={colours.primary} style={[styles.center]}
        onConnectionChange={(info, online) => {this.setState({ online: online })}}
      >
        <Modal
          theme={true} isVisible={this.state.modal} onCancel={() => this.setState({ modal: false})}
          style={[styles.center]}
        >
          <View>
            <Button
              width={240} label="Settings" icon="cog" style={styles.mt15}
              onPress={() => {
                this.setState({ modal: false });
                props.navigation.navigate('Settings');
              }}
            />            
            {
              props.session.user && 
              <Button
                width={240} label="Edit Profile" icon="user" style={styles.mt15}
                onPress={() => {
                  console.log('Edit Profile');
                }}
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
            <TouchableOpacity 
              style={[{width: 26, paddingTop: 15}]} activeOpacity={0.75} 
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
