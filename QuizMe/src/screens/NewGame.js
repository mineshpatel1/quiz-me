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
  }

  render() {
    let { props } = this;

    let extraSettings = null;
    if (props.navigation.getParam('mode') == 'multi') {
      extraSettings = {
        opponent: {
          label: "Choose Opponent",
          icon: "user",
          type: "string",
          inputType: "picker",
          options: props.session.friends,
          displayFn: val => { return val.name ? val.name : val.email },
          validator: val => {
            if (!val) return false;
            return Object.values(props.session.friends).map(f => { return f.id }).indexOf(val.id) > -1;
          },
        }
      }
    }

    return (
      <Container header={'New Game'}>
        <View style={[styles.f1, styles.col, styles.aCenter, styles.mt15]}>
          <SettingsForm
            onSave={(values) => {
              props.newGame(values, values.opponent);
              if (values.opponent) {
                props.navigation.navigate('MultiGame');
              } else {
                props.navigation.navigate('SingleGame');
              }
            }}
            onCancel={() => { props.navigation.navigate('Home'); }}
            save={false} extraSettings={extraSettings}
          />
        </View>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    session: state.session,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ newGame }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(NewGame);
