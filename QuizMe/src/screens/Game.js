import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Animated, Easing, View } from 'react-native';

import HandleBack from '../components/HandleBack';
import Timer from '../components/Timer';
import { Container, Header, Text, Button, Input } from '../components/Core';
import { styles, colours, fonts } from '../styles';
import { utils } from '../utils';
import { animationDuration } from '../config';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inPlay: false,
      preamble: false,
      opacity: new Animated.Value(1),
    }
  }

  onBack = () => { return false; }

  startPreamble = () => {
    this.setState({ preamble: true });
  }

  fade = (val, callback=null) => {
    Animated.timing(
      this.state.opacity,
      {
        toValue: val,
        duration: animationDuration,
        easing: Easing.ease,
      }
    ).start(callback);
  }

  startGame = () => {
    this.fade(0, () => {
      this.setState({ preamble: false, inPlay: true });
      this.fade(1);
    });
  }

  render() {
    let { props, state } = this;
    let turn = 1;

    let preGame = (
      <Animated.View style={[styles.f1, {opacity: state.opacity}]}>
        <View style={[styles.f1, styles.center]}>
          <Text color={colours.white} size={30} bold={true}>
            {'Are you Ready?'}
          </Text>
        </View>
        <View style={[styles.center, {marginBottom: 15}]}>
          {
            !state.preamble &&
            <Button
              icon="play" btnColor={colours.success}
              fontColor={colours.white} onPress={this.startPreamble}
            />
          }
          {
            state.preamble &&
            <Timer
              size={30} color={colours.white} length={3}
              format={(x) => {return x}} onFinish={this.startGame}
            />
          }
        </View>
      </Animated.View>
    )

    let inGame = (
      <Animated.View style={[styles.f1, { opacity: state.opacity }]}>
        <View style={[styles.row]}>
          <View style={styles.f1}>
            <Text color={colours.white} size={24} bold={true} align="left">
              {0}
            </Text>
          </View>
          <View style={{flex: 3}}>
            <Text color={colours.white} size={24} bold={true} align="center">
              {'QUESTION ' + turn.toString()}
            </Text>
          </View>
          <View style={styles.f1}>
            <Timer
              color={colours.white} size={24} bold={true} align="right"
              length={props.game.settings.timeLimit}
            >
              {0}
            </Timer>
          </View>
        </View>
        <View style={[styles.f1, styles.row, styles.aCenter]}>
          <Text color={colours.white} size={30} align={'center'}>
            {props.question.question}
          </Text>
        </View>
        <View style={[styles.f1, styles.col]} >
          <View style={[styles.f1, styles.row]}>
            <View style={[styles.option, {marginBottom: 5, marginRight: 5}]}>
              <Text size={24} align={'center'}>{props.question.options[0]}</Text>
            </View>
            <View style={[styles.option, {marginBottom: 5, marginLeft: 5}]}>
              <Text size={24} align={'center'}>{props.question.options[1]}</Text>
            </View>
          </View>
          <View style={[styles.f1, styles.row]}>
            <View style={[styles.option, {marginTop: 5, marginRight: 5}]}>
              <Text size={24} align={'center'}>{props.question.options[2]}</Text>
            </View>
            <View style={[styles.option, {marginTop: 5, marginLeft: 5}]}>
              <Text size={24} align={'center'}>{props.question.options[3]}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    )

    return (
      <HandleBack onBack={this.onBack}>
        <Container bgColor={colours.black} style={{padding: 30}}>
          {!state.inPlay && preGame}
          {state.inPlay && inGame}
        </Container>
      </HandleBack>
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
  bindActionCreators({ }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Game);
