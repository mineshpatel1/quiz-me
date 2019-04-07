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
      preGame: true,
      firstTurn: true,
      gaveOver: false,
      preamble: false,
      opacity: new Animated.Value(1),
      hudOpacity: new Animated.Value(0),
      disabled: true,
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

  fadeHud = (val, callback=null, duration=animationDuration) => {
    utils.animate(this.state.hudOpacity, val, duration, callback);
  }

  startGame = () => {
    this.fade(0, () => {
      this.setState({ preamble: false, preGame: false });

      this.fade(1, () => {
        // Wait to allow the user to read the question
        utils.sleep(this.props.game.settings.waitTime * 1000, () => {
          this.fadeHud(1, () => {
            this.timer.start();
            this.progressBar.start();
            this.setState({firstTurn: false, disabled: false});
          });
        });
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
    });
  }

  outOfTime = () => {
    if (this.mounted) {
      if (!this.state.chosen) {
        this.options[this.props.question.answer].highlight();
        this.setState({chosen: null, disabled: true});
      }
    }
  }

  nextQ = () => {
    let { props, state } = this;

    this.fade(0, () => {  // Fade out everything
      if (props.game.lastTurn()) {  // End the game otherwise
        this.setState({gameOver: true}, () => {
          this.fade(1);
        });
      } else {
        for (_key in this.options) {
          this.options[_key].reset();
        }

        props.nextTurn();
        this.timer.reset();
        this.progressBar.reset();

        this.fadeHud(0, null, 0);  // Hide the HUD
        this.fade(1, () => {  // Fade question in
          utils.sleep(props.game.settings.waitTime * 1000, () => {  // Let the user read the question
            this.fadeHud(1, () => {  // Fade in HUD
              this.timer.start();
              this.progressBar.start();
              this.setState({chosen: null, disabled: false});
            });
          });
        });
      }
    });

  }

  render() {
    let { props, state } = this;
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
                size={30} color={colours.white} length={props.game.settings.waitTime}
                format={(x) => {return x}} onFinish={this.startGame}
              />
            </View>
          }
        </View>
      </Animated.View>
    )

    let inGame = (
      <Animated.View style={[styles.f1, { opacity: state.opacity }]}>
        <Animated.View style={[styles.row, {opacity: state.hudOpacity}]}>
          <View style={styles.f1}>
            <Text color={colours.white} size={24} bold={true} align="left">
              {props.game.score}
            </Text>
          </View>
          <View style={{flex: 3}}>
            <Text color={colours.white} size={24} bold={true} align="center">
              {'Question ' + (props.game.turn + 1)}
            </Text>
          </View>
          {
            state.disabled && !state.firstTurn &&
            <Timer
              size={24} bold={true} color={colours.black} length={props.game.settings.waitTime}
              format={(x) => {return x}}  onFinish={this.nextQ} invisible={true}
            />
          }
          <View style={styles.f1}>
            <Timer
              color={colours.white} size={24} bold={true} align="right"
              length={props.game.settings.timeLimit} auto={false}
              ref={x => { this.timer = x }}
            />
          </View>
        </Animated.View>
        <Animated.View style={{opacity: state.hudOpacity}}>
          <ProgressBar
            style={styles.mt15} duration={1000 * props.game.settings.timeLimit}
            ref={(x) => { this.progressBar = x; }} onFinish={this.outOfTime}
          />
        </Animated.View>
        <View style={[styles.f1, styles.row, styles.aCenter]}>
          <Text color={colours.white} size={30} align={'center'}>
            {props.question.question}
          </Text>
        </View>
        <Animated.View style={[styles.f1, styles.col, {opacity: state.hudOpacity}]} >
          <View style={[styles.f1, styles.row]}>
            <Option {...options[0]} style={[{marginBottom: 5, marginRight: 5}]} />
            <Option {...options[1]} style={[{marginBottom: 5, marginLeft: 5}]} />
          </View>
          <View style={[styles.f1, styles.row]}>
            <Option {...options[2]} style={[{marginTop: 5, marginRight: 5}]} />
            <Option {...options[3]} style={[{marginTop: 5, marginLeft: 5}]} />
          </View>
        </Animated.View>
      </Animated.View>
    )

    let gameOver = (
      <Animated.View style={[styles.f1, { opacity: state.opacity }]}>
        <View style={[styles.f1, {justifyContent: 'center'}]}>
          <Text bold={true} size={30} color={colours.white} align="center">
            {'GAME OVER'}
          </Text>
        </View>
        <View style={styles.f1}>
          <Text color={colours.white} size={30} bold={true} align="center">
            {'Score: ' + props.game.score + ' / ' + props.game.settings.numQuestions}
          </Text>
        </View>
        <View style={[styles.center, styles.mt15]}>
          <Button
            label="Back" icon="home"
            onPress={() => { props.navigation.navigate('Home') }}
          />
        </View>
      </Animated.View>
    )

    return (
      <HandleBack onBack={this.onBack}>
        <Container bgColor={colours.black} style={{padding: 30}}>
          {state.preGame && preGame}
          {!state.preGame && !state.gameOver && inGame}
          {state.gameOver && gameOver}
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
