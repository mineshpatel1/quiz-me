import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Animated, Easing, View, TouchableOpacity } from 'react-native';

import HandleBack from '../components/HandleBack';
import ProgressCircle from '../components/ProgressCircle';
import Modal from '../components/Modal';
import Timer from '../components/Timer';
import Option from '../components/Option';
import ProgressBar from '../components/ProgressBar';
import { Container, Text, Button } from '../components/Core';

import { styles, colours } from '../styles';
import { utils } from '../utils';
import { waitTime, animationDuration } from '../config';
import { nextTurn, chooseAnswer } from '../actions/GameActions';

class Game extends Component {
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

  componentDidMount() { this.mounted = true; }
  componentWillUnmount() { this.mounted = false; }
  onBack = () => { this.pause(); return true; }

  fade = (val, callback=null) => {
    utils.animate(this.state.opacity, val, animationDuration, callback);
  }

  fadeHud = (val, callback=null, duration=animationDuration) => {
    utils.animate(this.state.hudOpacity, val, duration, callback);
  }

  startGame = () => {
    this.fade(0, () => {
      this.setState({ preGame: false });

      this.fade(1, () => {
        // Wait to allow the user to read the question
        utils.sleep(waitTime * 1000, () => {
          this.fadeHud(1, () => {
            if (this.mounted) {
              this.timer.start();
              this.progressBar.start();
              this.setState({firstTurn: false, disabled: false});
            }
          });
        });
      });
    });
  }

  chooseAnswer = (opt) => {
    let { props, state } = this;
    let answer = props.question.answer;

    props.chooseAnswer(opt);
    if (opt != answer) {
      this.options[answer].highlight();
    }

    this.setState({chosen: opt, disabled: true}, () => {
      this.timer.stop();
      this.progressBar.stop();
    });
  }

  outOfTime = () => {
    if (this.mounted) {
      if (!this.state.chosen) {
        this.props.chooseAnswer(null);
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

        props.nextTurn(state.chosen);
        this.timer.reset();
        this.progressBar.reset();

        this.fadeHud(0, null, 0);  // Hide the HUD
        this.fade(1, () => {  // Fade question in
          utils.sleep(waitTime * 1000, () => {  // Let the user read the question
            this.fadeHud(1, () => {  // Fade in HUD
              if (this.mounted) {
                this.timer.start();
                this.progressBar.start();
                this.setState({chosen: null, disabled: false});
              }
            });
          });
        });
      }
    });
  }

  pause = () => {
    let { state } = this;

    if (state.gameOver) {
      this.props.navigation.navigate('Home');
    } else {
      this.setState({paused: true});
    }
  }

  unpause = () => {
    this.setState({paused: false});
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
          <Text colour={colours.white} size={30} bold={true}>
            {'Are you Ready?'}
          </Text>
        </View>
        <View style={[styles.center, {marginBottom: 15}]}>
          <Button
            icon="play" btnColour={colours.success}
            fontColour={colours.white} onPress={this.startGame}
          />
        </View>
      </Animated.View>
    )

    let inGame = (
      <Animated.View style={[styles.f1, { opacity: state.opacity }]}>
        <Animated.View style={[styles.row, {opacity: state.hudOpacity}]}>
          <View style={styles.f1}>
            <Text colour={colours.white} size={24} bold={true} align="left">
              {props.game.score}
            </Text>
          </View>
          <View style={{flex: 3}}>
            <Text colour={colours.white} size={24} bold={true} align="center">
              {'Question ' + (props.game.turn + 1)}
            </Text>
          </View>
          {
            state.disabled && !state.firstTurn &&
            <Timer
              size={24} bold={true} colour={colours.black} length={waitTime}
              auto={true} onFinish={this.nextQ} invisible={true}
            />
          }
          <View style={styles.f1}>
            <Timer
              colour={colours.white} size={24} bold={true} align="right"
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
          <Text colour={colours.white} size={30} align={'center'}>
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
          <Text bold={true} size={30} colour={colours.white} align="center">
            {'GAME OVER'}
          </Text>
        </View>
        <View style={[styles.center, styles.f3]}>
          <ProgressCircle
            fill={parseInt((props.game.score * 100) / props.game.settings.numQuestions)}
            textColour={colours.white} duration={1000}
          />
        </View>
        <View style={[styles.center, styles.mt15]}>
          <Button
            label="Summary" icon="book-open"
            onPress={() => { props.navigation.navigate('GameSummary') }}
          />
          <Button
            label="Back" icon="home" style={styles.mt15}
            onPress={() => { props.navigation.navigate('Home') }}
          />
        </View>
      </Animated.View>
    )

    return (
      <HandleBack onBack={this.onBack}>
        <Container bgColour={colours.black} style={{padding: 30}}>
          <Modal
            theme={true} isVisible={this.state.paused} onCancel={this.unpause}
            style={[styles.center]}
          >
            <View>
              <Button
                width={220} label="Resume" icon="play" onPress={() => {
                  this.unpause();
                }}
              />
              <Button
                style={styles.mt15} width={220} label="Home" icon="home"
                onPress={() => {
                  this.unpause();
                  this.props.navigation.navigate('Home');
                }}
              />
            </View>
          </Modal>
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
  bindActionCreators({ nextTurn, chooseAnswer }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Game);
