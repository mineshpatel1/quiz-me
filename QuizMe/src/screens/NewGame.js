import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';

import SettingsForm from '../components/SettingsForm';
import { Container } from '../components/Core';
import { newGame } from '../actions/GameActions';
import { styles } from '../styles';

class NewGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 'java',
    }
  }

  render() {
    let { props } = this;
    return (
      <Container header={'New Game'}>
        <View style={[styles.f1, styles.col, styles.aCenter]}>
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
