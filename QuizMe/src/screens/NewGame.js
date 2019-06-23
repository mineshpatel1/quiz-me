import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';

import SettingsForm from '../components/SettingsForm';
import { Container, SnackBar } from '../components/Core';
import { newGame } from '../actions/GameActions';
import { styles } from '../styles';
import api from '../utils/api';

class NewGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    }
  }

  showError = err => {
    this.setState({ loading: false });
    this.refs.error.show(err, 0);
  }

  render() {
    let { props } = this;

    let extraSettings, extraValues;
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
      if (props.navigation.getParam('opponent')) {
        extraValues = { opponent: props.navigation.getParam('opponent') };
      }
    }

    return (
      <Container header={'New Game'}>
        <View style={[styles.f1, styles.col, styles.aCenter, styles.mt15]}>
          <SettingsForm
            onSave={(values) => {
              let { opponent, ...settings } = values;
              if (!opponent) return props.navigation.navigate('SingleGame');
              
              this.setState({ loading: true });
              api.gameRequest(settings, opponent)
                .then(() => {
                  this.setState({ loading: false });
                  props.newGame(settings, props.session.user, opponent);
                  props.navigation.navigate('MultiGame');
                })
                .catch(this.showError);
            }}
            onCancel={() => { props.navigation.navigate('Home'); }}
            save={false} extraSettings={extraSettings} extraValues={extraValues}
          />
        </View>
        <SnackBar ref="error" error={true} />
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    session: state.session,
    game: state.game.currentGame,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ newGame }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(NewGame);
