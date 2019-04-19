import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Animated, View, ScrollView, TouchableOpacity } from 'react-native';

import Option from '../components/Option';
import { Container, Text, Icon, Button } from '../components/Core';
import { styles, colours } from '../styles';
import { utils } from '../utils';

class GameSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      margin: new Animated.Value(0),
      opacity: new Animated.Value(0),
      width: null,
    }
  }

  onLayout = (e) => {
    this.setState({width: e.nativeEvent.layout.width});
    utils.animate(this.state.opacity, 1);
  }

  scroll(direction=1) {
    let newIdx = this.state.index + (1 * direction);
    this.setState({ index: newIdx });
    utils.animate(this.state.margin, -1 * this.state.width * newIdx);
  }

  right() {
    if ((this.state.index + 1) < this.props.game.questions.length) this.scroll();
  }
  left() {
    if (this.state.index > 0) this.scroll(-1);
  }

  render() {
    let { props, state } = this;
    let questions = [];

    for (q of props.game.questions) {
      let _options = [];
      q.options.map((opt, i) => {
        let _opt = {
          text: q.options[i],
          disabled: true,
          textSize: 20,
        }

        if (i == 0) {
          _opt.style = {marginBottom: 5, marginRight: 5};
        } else if (i == 1) {
          _opt.style = {marginBottom: 5, marginLeft: 5};
        } else if (i == 2) {
          _opt.style = {marginTop: 5, marginRight: 5};
        } else if (i == 3) {
          _opt.style = {marginTop: 5, marginLeft: 5};
        }

        if (opt == q.answer) {
          _opt.bgColour = colours.success;
          _opt.textColour = colours.white;
          _opt.bold = true;
        } else if (!q.chosen || (q.chosen != q.answer && opt == q.chosen)) {
          _opt.bgColour = colours.error;
          _opt.textColour = colours.white;
          _opt.bold = true;
        }
        _options.push(_opt);
      });
      q._options = _options;
      questions.push(q);
    }

    console.log(questions);

    return (
      <Container bgColour={colours.black}>
        <View style={[styles.row]}>
          <View style={[styles.row, {marginLeft: 45, paddingTop: 30}]}>
            <TouchableOpacity onPress={() => {props.navigation.goBack()}}>
              <Icon icon='chart-pie' colour={colours.white} size={24} />
            </TouchableOpacity>
          </View>
          <View style={[styles.row, styles.center, {flex: 1, padding: 30}]}>
            <Text size={24} colour={colours.white}>Review</Text>
          </View>
          <View style={[styles.row, {marginRight: 45, paddingTop: 30}]}>
            <TouchableOpacity onPress={() => {props.navigation.navigate('Home')}}>
              <Icon icon='home' colour={colours.white} size={24} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.f1, styles.row, {marginBottom: 10}]}>
          <View style={[styles.col, styles.center, {width: '10%'}]}>
            {
              (state.index > 0) &&
              <TouchableOpacity onPress={() => this.left()}>
                <Icon icon='chevron-left' colour={colours.white} />
              </TouchableOpacity>
            }
          </View>
          <View style={[{width: '80%', overflow: 'hidden'}]} onLayout={this.onLayout}>
            <View style={[ styles.row, {
              marginTop: 0, borderWidth: 2, width: '100%', height: '100%',
              padding: 15, borderColor: colours.midGrey,
            }]}>
              <Animated.View style={[styles.row,
                {opacity: state.opacity, transform: [{translateX: state.margin}]}
              ]}>
                {
                  questions.map((q, i) => (
                    <View key={i} style={{marginLeft: (i > 0 ? 34 : 0), width: state.width - 34, height: '100%'}}>
                      <View style={[styles.f1, styles.row, styles.aCenter]}>
                        <Text colour={colours.white} size={26} align={'center'}>
                          {questions[i].question}
                        </Text>
                      </View>
                      <View style={[styles.f1, styles.col]} >
                        <View style={[styles.f1, styles.row]}>
                          <Option {...questions[i]._options[0]} />
                          <Option {...questions[i]._options[1]} />
                        </View>
                        <View style={[styles.f1, styles.row]}>
                          <Option {...questions[i]._options[2]} />
                          <Option {...questions[i]._options[3]} />
                        </View>
                      </View>
                    </View>
                  ))
                }
              </Animated.View>
            </View>
          </View>
          <View style={[styles.col, styles.center, {width: '10%'}]}>
            {
              ((state.index + 1) < questions.length) &&
              <TouchableOpacity onPress={() => this.right()}>
                <Icon icon='chevron-right' colour={colours.white} />
              </TouchableOpacity>
            }
          </View>
        </View>
        <View style={[styles.row, styles.center]}>
          <Text colour={colours.white}>
            {(state.index + 1).toString() + "/" + questions.length.toString()}
          </Text>
        </View>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    game: state.game.currentGame,
  }
};

export default connect(mapStateToProps)(GameSummary);
