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

  right(questions) {
    if ((this.state.index + 1) < questions.length) this.scroll();
  }
  left() {
    if (this.state.index > 0) this.scroll(-1);
  }

  render() {
    let { props, state } = this;
    let game = {
      settings: { category: 'General Knowledge', numQuestions: 3, timeLimit: 3 },
      score: 1,
      turn: 2,
      questions:
       [
           { id: 15,
             question: 'In the book The Last Of The Mohicans what was the name of Chingachgook\'s only son?',
             options: [ 'Lightfoot', 'Magua', 'Uncas', 'Mingo' ],
             answer: 'Uncas',
             category_id: 1,
             chosen: 'Uncas' },
           { id: 241,
             question: 'What are the names of the two main characters in Diana Gabaldon\'s highland saga novels?',
             options:
              [ 'Hamish and Maggie',
                'Fergus and Fiona',
                'Jamie and Claire',
                'Rab and Elizabeth' ],
             answer: 'Jamie and Claire',
             category_id: 1,
             chosen: null },
           { id: 452,
             question: 'Which of these chess figures is closely related to \'Bohemian Rhapsody\'?',
             options: [ 'King', 'Pawn ', 'Queen', 'Bishop' ],
             answer: 'Queen',
             category_id: 1,
             chosen: 'Bishop' }
         ]
    }

    let questions = game.questions;
    let currentQ = questions[state.index];

    return (
      <Container bgColour={colours.black}>
        <View style={[styles.row]}>
          <View style={[styles.row, {marginLeft: 45, paddingTop: 30}]}>
            <TouchableOpacity onPress={() => {console.log('Back')}}>
              <Icon icon='chart-pie' colour={colours.white} size={24} />
            </TouchableOpacity>
          </View>
          <View style={[styles.row, styles.center, {flex: 1, padding: 30}]}>
            <Text size={24} colour={colours.white}>Review</Text>
          </View>
          <View style={[styles.row, {marginRight: 45, paddingTop: 30}]}>
            <TouchableOpacity onPress={() => {console.log('Close')}}>
              <Icon icon='home' colour={colours.white} size={24} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.f1, styles.row, {marginBottom: 10}]}>
          <View style={[styles.col, styles.center, {width: '10%'}]}>
            <TouchableOpacity onPress={() => this.left()}>
              <Icon icon='chevron-left' colour={colours.white} />
            </TouchableOpacity>
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
                          <Option text={questions[i].options[0]} disabled={true} textSize={20} style={[{marginBottom: 5, marginRight: 5}]} />
                          <Option text={questions[i].options[1]} disabled={true} textSize={20} style={[{marginBottom: 5, marginLeft: 5}]} />
                        </View>
                        <View style={[styles.f1, styles.row]}>
                          <Option text={questions[i].options[2]} disabled={true} textSize={20} style={[{marginTop: 5, marginRight: 5}]} />
                          <Option text={questions[i].options[3]} disabled={true} textSize={20} style={[{marginTop: 5, marginLeft: 5}]} />
                        </View>
                      </View>
                    </View>
                  ))
                }
              </Animated.View>
            </View>
          </View>
          <View style={[styles.col, styles.center, {width: '10%'}]}>
            <TouchableOpacity onPress={() => this.right(questions)}>
              <Icon icon='chevron-right' colour={colours.white} />
            </TouchableOpacity>
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
