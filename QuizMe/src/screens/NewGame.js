import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';

import SettingsForm from '../components/SettingsForm';
import { Container, Header, Text, Button, Input, Picker } from '../components/Core';
import { newGame } from '../actions/GameActions';
import { styles, colours } from '../styles';
import { utils } from '../utils';

class NewGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 'java',
    }
  }

  render() {
    let { props, state } = this;

    testPicker = [
      {name: 'Java', value: 'java'},
      {name: 'Python', value: 'python'},
    ]
    return (
      <Container>
        <Header title={'New Game'} route={'Home'}/>
        <View style={[styles.f1, styles.col, styles.aCenter]}>
          {/* <View>
            <Picker icon="th" value="General Knowledge" />
          </View> */}
          <SettingsForm
            onSave={(values) => {
              props.newGame(values);
              props.navigation.navigate('Game');
            }}
            onCancel={() => { props.navigation.navigate('Home'); }}
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
