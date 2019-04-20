import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Animated, View, ScrollView, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';

import Option from '../components/Option';
import { Container, Text, Icon, Button, IconButton } from '../components/Core';
import { styles, colours, fonts } from '../styles';
import { utils } from '../utils';

class GameSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    }
  }

  left() { if (this.state.index > 0) this.content.scrollBy(-1); }

  right() {
    if ((this.state.index + 1) < this.props.game.questions.length) {
      this.content.scrollBy(1);
    }
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
      q.optionStyle = _options.length == 2 ? { height: 125 } : styles.f1;
      q.textSize = utils.scaleQText(q.question, 26);
      questions.push(q);
    }

    let borderColour = colours.error;
    if (questions[state.index].chosen == questions[state.index].answer) {
      borderColour = colours.success;
    }

    return (
      <Container bgColour={colours.black}>
        <View style={[styles.row]}>
          <IconButton
            icon='chart-pie' onPress={() => {props.navigation.goBack()}}
            style={[{marginLeft: 45, paddingTop: 30}]}
          />
          <View style={[styles.row, styles.center, {flex: 1, padding: 30}]}>
            <Text size={24} colour={colours.white} display={true}>Quiz Review</Text>
          </View>
          <IconButton
            icon='home' onPress={() => {props.navigation.navigate('Home')}}
            style={[styles.row, {marginRight: 45, paddingTop: 30}]}
          />
        </View>
        <View style={[styles.f1, styles.row]}>
          <View style={[styles.center, {width: 45}]}>
            {
              state.index > 0 &&
              <IconButton icon='chevron-left' onPress={() => { this.left() }} />
            }
          </View>
          <View style={[styles.f1, {
            overflow: 'hidden', borderRadius: 10, borderColor: borderColour, borderWidth: 2,
          }]}>
            <Swiper
              autoplay={false} showsPagination={false}
              loop={false} style={styles.f1}
              ref={(x) => { this.content = x; }}
              onIndexChanged={(idx) => { this.setState({index: idx}); }}
            >
              {
                questions.map((q, i) => (
                  <View key={i} style={[styles.f1, { padding: 15 }]}>
                    <View style={[styles.f1, styles.row, styles.aCenter]}>
                      <Text
                        colour={colours.white} size={questions[i].textSize}
                        align={'center'}
                      >
                        {questions[i].question}
                      </Text>
                    </View>
                    <View style={[styles.f1, styles.col, styles.center]} >
                      <View style={[styles.row, questions[i].optionStyle]}>
                        <Option {...questions[i]._options[0]} />
                        <Option {...questions[i]._options[1]} />
                      </View>
                      {
                        questions[i]._options.length == 4 &&
                        <View style={[styles.f1, styles.row]}>
                          <Option {...questions[i]._options[2]} />
                          <Option {...questions[i]._options[3]} />
                        </View>
                      }
                    </View>
                  </View>
                ))
              }
            </Swiper>
          </View>
          <View style={[styles.center, {width: 45}]}>
            {
              (state.index + 1) < questions.length &&
              <IconButton icon='chevron-right' onPress={() => { this.right() }} />
            }
          </View>
        </View>
        <View style={[styles.center, {padding: 10}]}>
          <Text colour={colours.white}>{(state.index + 1) + '/' + questions.length}</Text>
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
