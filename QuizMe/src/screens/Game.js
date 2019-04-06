import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Animated, Easing, View, TouchableOpacity } from 'react-native';

import HandleBack from '../components/HandleBack';
import Timer from '../components/Timer';
import Option from '../components/Option';
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
      progress: new Animated.Value(0),
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

  animateProgress(val, duration, callback=null) {
    utils.animate(this.state.progress, val, duration, callback, Easing.linear);
  }

  startGame = () => {
    this.fade(0, () => {
      this.setState({ preamble: false, inPlay: true });
      this.animateProgress(100, 0);

      this.fade(1, () => {
        this.timer.startTimer();
        this.animateProgress(0, this.props.game.settings.timeLimit * 1000, this.outOfTime);
      });
    });
  }

  outOfTime = () => {
    if (this.mounted) {
      console.log("YOU ARE OUT OF TIME BUDDY");
    }
  }

  render() {
    let { props, state } = this;
    let turn = 1;
    let options = utils.shuffle(props.question.options);
    let highlights = [];

    for (let opt of options) {
      if (opt == props.question.answer) {
        highlights.push(colours.success);
      } else {
        highlights.push(colours.error);
      }
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
                size={30} color={colours.white} length={1}
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
              length={props.game.settings.timeLimit} auto={false}
              ref={x => { this.timer = x }}
            >
              {0}
            </Timer>
          </View>
        </View>
        <Animated.View style={{
          height: 5, marginTop: 5, marginBottom: 5, backgroundColor: '#fff',
          width: state.progress.interpolate({
            inputRange: [0, 100], outputRange: ['0%', '100%'],
          }),
        }} />
        <View style={[styles.f1, styles.row, styles.aCenter]}>
          <Text color={colours.white} size={30} align={'center'}>
            {props.question.question}
          </Text>
        </View>
        <View style={[styles.f1, styles.col]} >
          <View style={[styles.f1, styles.row]}>
            <Option text={options[0]} bgHighlight={highlights[0]} style={[{marginBottom: 5, marginRight: 5}]} />
            <Option text={options[1]} bgHighlight={highlights[1]} style={[{marginBottom: 5, marginLeft: 5}]} />
          </View>
          <View style={[styles.f1, styles.row]}>
            <Option text={options[2]} bgHighlight={highlights[2]} style={[{marginTop: 5, marginRight: 5}]} />
            <Option text={options[3]} bgHighlight={highlights[3]} style={[{marginTop: 5, marginLeft: 5}]} />
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
