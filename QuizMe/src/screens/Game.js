import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Animated, Easing, View, TouchableOpacity } from 'react-native';

import HandleBack from '../components/HandleBack';
import Timer from '../components/Timer';
import Option from '../components/Option';
import ProgressBar from '../components/ProgressBar';
import { Container, Header, Text, Button, Input } from '../components/Core';
import { styles, colours, fonts } from '../styles';
import { utils } from '../utils';
import { animationDuration, waitTime } from '../config';
import { nextTurn, increment } from '../actions/GameActions';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inPlay: false,
      preamble: false,
      opacity: new Animated.Value(1),
      qOpacity: new Animated.Value(1),
      disabled: false,
      chosen: null,
    }
  }

  componentDidMount() { this.mounted = true; }
  componentWillUnmount() { this.mounted = false; }
  onBack = () => { return false; }

  startPreamble = () => {
    this.setState({ preamble: true });
  }

  fade = (val, callback=null) => {
    utils.animate(this.state.opacity, val, animationDuration, callback);
  }

  startGame = () => {
    this.fade(0, () => {
      this.setState({ preamble: false, inPlay: true });

      this.fade(1, () => {
        this.timer.start();
        this.progressBar.start();
      });
    });
  }

  chooseAnswer = (opt) => {
    let { props, state } = this;
    let answer = props.question.answer;
    if (opt != answer) {
      this.options[answer].highlight();
    } else {
      props.increment();
    }

    this.setState({chosen: opt, disabled: true}, () => {
      this.timer.stop();
      this.progressBar.stop();
      this.nextQ();
    });
  }

  outOfTime = () => {
    if (this.mounted) {
      if (!this.state.chosen) {
        this.options[this.props.question.answer].highlight();
        this.setState({chosen: null, disabled: true}, () => {
          this.nextQ();
        });
      }
    }
  }

  nextQ = () => {
    let { props, state } = this;
    let answer = props.question.answer;

    utils.sleep(waitTime * 1000, () => {
      for (_key in this.options) {
        this.options[_key].reset();
      }

      props.nextTurn();
      this.timer.restart();
      this.progressBar.restart();
      this.setState({chosen: null, disabled: false});
    });
  }

  render() {
    let { props, state } = this;
    let turn = 1;
    let options = [];
    this.options = {};

    for (let opt of props.question.options) {
      let highlight = colours.error;
      if (opt == props.question.answer) highlight = colours.success;
      options.push({
        text: opt, bgHighlight: highlight, disabled: state.disabled,
        onPress: () => { this.chooseAnswer(opt) },
        ref: (x) => { this.options[opt] = x },
      });
    }

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
            <View style={{height: 50}}>
              <Timer
                size={30} color={colours.white} length={waitTime}
                format={(x) => {return x}} onFinish={this.startGame}
              />
            </View>
          }
        </View>
      </Animated.View>
    )

    let inGame = (
      <Animated.View style={[styles.f1, { opacity: state.opacity }]}>
        <View style={[styles.row]}>
          <View style={styles.f1}>
            <Text color={colours.white} size={24} bold={true} align="left">
              {props.game.score}
            </Text>
          </View>
          <View style={{flex: 3}}>
            <Text color={colours.white} size={24} bold={true} align="center">
              {'QUESTION ' + (props.game.turn + 1)}
            </Text>
          </View>
          <View style={styles.f1}>
            <Timer
              color={colours.white} size={24} bold={true} align="right"
              length={props.game.settings.timeLimit} auto={false}
              ref={x => { this.timer = x }}
            />
          </View>
        </View>
        <ProgressBar
          style={styles.mt15} duration={1000 * props.game.settings.timeLimit}
          ref={(x) => { this.progressBar = x; }} onComplete={this.outOfTime}
        />
        <View style={[styles.f1, styles.row, styles.aCenter]}>
          <Text color={colours.white} size={30} align={'center'}>
            {props.question.question}
          </Text>
        </View>
        <View style={[styles.f1, styles.col]} >
          <View style={[styles.f1, styles.row]}>
            <Option {...options[0]} style={[{marginBottom: 5, marginRight: 5}]} />
            <Option {...options[1]} style={[{marginBottom: 5, marginLeft: 5}]} />
          </View>
          <View style={[styles.f1, styles.row]}>
            <Option {...options[2]} style={[{marginTop: 5, marginRight: 5}]} />
            <Option {...options[3]} style={[{marginTop: 5, marginLeft: 5}]} />
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
  bindActionCreators({ nextTurn, increment }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Game);
