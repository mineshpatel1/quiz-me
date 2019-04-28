import React, { Component } from 'react';
import { Animated, View, Image } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

import { Container, Button, Modal, SnackBar } from '../components/Core';
import { colours, styles } from '../styles';
import { utils } from '../utils';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      online: false,
      modal: false,
    }
  }

  componentWillMount() {
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
              width={220} label="Sign Up" icon="user-plus" onPress={() => {
                this.setState({ modal: false });
                this.props.navigation.navigate('EditUser', {create: true});
              }}
            />
            <Button
              style={styles.mt15} width={220} label="Sign In" icon="sign-in-alt"
              onPress={() => {
               console.log('Sign In');
              }}
            />
          </View>
        </Modal>
        <Animated.View style={{opacity: state.opacity}}>
          <View style={[styles.f1, {justifyContent: 'flex-end', alignItems: 'center'}]}>
            <Image style={{width: 400, height: 150}} source={require('../../assets/images/title.png')} />
          </View>

          <View style={[styles.f1, styles.center]}>
            <Button
              label="Single Player" icon="play"
              onPress={() => { props.navigation.navigate('NewGame') }}
            />
            <Button
              label="Head to Head" icon="play" style={styles.mt15} disabled={!state.online}
              onPress={() => {
                utils.get('session')
                  .then(out => {
                    if (!out.hasOwnProperty('session')) {
                      this.setState({ modal :true });
                    }
                  })
                  .catch(err => {
                    this.refs.error.show(err.toString(), 0);
                  })
              }}
            />
            <Button
              label="Settings" icon="cog" style={styles.mt15}
              onPress={() => { props.navigation.navigate('Settings') }}
            />
          </View>
        </Animated.View>
        <SnackBar ref="error" error={true} />
      </Container>

    );
  }
}
