import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, View } from 'react-native';
import Swiper from 'react-native-swiper';

import Option from '../components/Option';
import { Container, Text, Icon } from '../components/Core';
import { styles, colours } from '../styles';
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
    if (questions.length != 0) {
      if (questions[state.index].chosen == questions[state.index].answer) {
        borderColour = colours.success;
      }
    }
    
    let iosAdjust = { top: 0, bottom: 0, swiper: styles.f1, clipped: true };
    if (Platform.OS == 'ios') {
      iosAdjust = { top: 10, bottom: 15, swiper: {}, clipped: false };
    }

    return (
      <Container bgColour={colours.black}>
        <View style={[styles.row, {marginTop: iosAdjust.top}]}>
          <Icon
            icon='chart-pie' onPress={() => {props.navigation.goBack()}}
            style={[{marginLeft: 45, paddingTop: 30}]} colour={colours.white}
          />
          <View style={[styles.row, styles.center, {flex: 1, padding: 30}]}>
            <Text size={24} colour={colours.white} display={true}>Quiz Review</Text>
          </View>
          <Icon
            icon='home' onPress={() => {props.navigation.navigate('Home')}}
            style={[styles.row, {marginRight: 45, paddingTop: 30}]} colour={colours.white}
          />
        </View>
        <View style={[styles.f1, styles.row]}>
          <View style={[styles.center, {width: 45}]}>
            {
              state.index > 0 &&
              <Icon icon='chevron-left' onPress={() => { this.left() }} colour={colours.white} />
            }
          </View>
          <View style={[styles.f1, {
            overflow: 'hidden', borderRadius: 10, borderColor: borderColour, borderWidth: 2,
          }]}>
            <Swiper
              ref={(x) => { this.content = x; }} loop={false}
              onIndexChanged={(idx) => { this.setState({index: idx}); }}
              showsPagination={false} autoplay={false}
              style={iosAdjust.swiper} removeClippedSubviews={iosAdjust.clipped}
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
              <Icon icon='chevron-right' onPress={() => { this.right() }} colour={colours.white} />
            }
          </View>
        </View>
        <View style={[styles.center, {padding: 10, marginBottom: iosAdjust.bottom}]}>
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
