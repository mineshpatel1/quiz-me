import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Platform, Animated, ScrollView, View } from 'react-native';

import HandleBack from '../components/HandleBack';
import Option from '../components/Option';
import PauseModal from '../components/PauseModal';
import {
  Container, Text, Button, Modal, Timer, ProgressBar, ProgressCircle,
} from '../components/Core';

import { styles, colours } from '../styles';
import { utils } from '../utils';
import { waitTime, animationDuration } from '../config';
import { newGame, nextTurn, chooseAnswer } from '../actions/GameActions';

class MultiGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      preGame: true,
      firstTurn: true,
      gameOver: false,
      opacity: new Animated.Value(1),
      hudOpacity: new Animated.Value(0),
      disabled: true,
      chosen: null,
      paused: false,
    }
  }

  render() {
    let { props, state } = this;
    let preGame = (
      <Animated.View style={[styles.f1, {opacity: state.opacity}]}>
        <View style={[styles.f1, styles.center]}>
          <Text colour={colours.white} size={38} display={true}>
            {'Are you Ready?'}
          </Text>
        </View>
        <View style={[styles.center, {marginBottom: 15}]}>
          <Button
            icon="play" btnColour={colours.success} borderWidth={0}
            fontColour={colours.white} onPress={this.startGame}
          />
        </View>
      </Animated.View>
    )

    return (
      <Container bgColour={colours.black} style={{padding: 30}}>
        <PauseModal route="Home" />
        {state.preGame && preGame}
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    game: state.game.currentGame,
    question: state.game.question,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ nextTurn, chooseAnswer, newGame }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(MultiGame);
