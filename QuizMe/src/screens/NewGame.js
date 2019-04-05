import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';

import SettingsForm from '../components/SettingsForm';
import { Container, Header, Text, Button, Input } from '../components/Core';
import { newGame } from '../actions/GameActions';
import { styles, colours } from '../styles';
import { utils } from '../utils';

class NewGame extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { props, state } = this;
    return (
      <Container>
        <Header title={'New Game'} route={'Home'}/>
        <View style={[styles.f1, styles.col, {alignItems: 'center'}]}>
          <SettingsForm
            onSave={(values) => {
              props.newGame(values);
              props.navigation.navigate('Game');
            }}
            onCancel={() => { props.navigation.goBack(); }}
            save={false}
          />
        </View>
      </Container>
    )
  }
}

const mapStateToProps = (state) => { return {} };
const mapDispatchToProps = dispatch => (
  bindActionCreators({ newGame }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(NewGame);
