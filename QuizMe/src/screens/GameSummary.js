import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Animated, View, ScrollView, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';

import Option from '../components/Option';
import { Container, Text, Icon, Button } from '../components/Core';
import { styles, colours } from '../styles';
import { utils } from '../utils';

class GameSummary extends Component {
  constructor(props) {
    super(props);
  }

  renderPagination = (index, total, context) => {
    return (
      <View style={[styles.center, styles.mt10]}>
        <Text colour={colours.white}>
          {(index + 1).toString() + '/' + total.toString()}
        </Text>
      </View>
    )
  }

  render() {
    let { props, state } = this;

    let prevBtn = ( <Icon icon='chevron-left' colour={colours.white} /> )
    let nextBtn = ( <Icon icon='chevron-right' colour={colours.white} /> )

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
      q.textSize = utils.scaleText(q.question, 26);
      questions.push(q);
    }

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
        <Swiper
          showsButtons={true} prevButton={prevBtn} nextButton={nextBtn} autoplay={false}
          renderPagination={this.renderPagination} loop={false}
        >
          {
            questions.map((q, i) => (
              <View key={i} style={[styles.f1, {
                marginLeft: 45, marginRight: 45, padding: 15,
                borderColor: colours.midGrey, borderWidth: 2
              }]}>
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
        </Swiper>
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
