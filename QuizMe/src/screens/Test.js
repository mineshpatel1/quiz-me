import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Animated, View, ScrollView, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';

import Option from '../components/Option';
import { Container, Text, Icon, Button } from '../components/Core';
import { styles, colours } from '../styles';
import { utils } from '../utils';

export default class Test extends Component {
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

    let prevBtn = (
      <Icon icon='chevron-left' colour={colours.white} />
    )
    let nextBtn = (
      <Icon icon='chevron-right' colour={colours.white} />
    )

    let questions = [
      { id: 163,
        question: 'Pigs cant fly, but which one of these CAN they do?',
        options:
         [ 'Swim',
           'Stand on their two back legs with there front ones in the air for up to 48 minutes',
           'Run 30 Mph',
           'Grow a 3rd ear in the Winter' ],
        answer: 'Swim',
        category_id: 1,
        chosen: 'Run 30 Mph',
        _options:
         [ { text: 'Swim',
             disabled: true,
             textSize: 20,
             style: { flex: 1, marginBottom: 5, marginRight: 5 },
             bgColour: '#5CB85C',
             textColour: '#FFFFFF',
             bold: true },
           { text: 'Stand on their two back legs with there front ones in the air for up to 48 minutes',
             disabled: true,
             textSize: 20,
             style: { flex: 1, marginBottom: 5, marginLeft: 5 } },
           { text: 'Run 30 Mph',
             disabled: true,
             textSize: 20,
             style: { flex: 1, marginTop: 5, marginRight: 5 },
             bgColour: '#D9534F',
             textColour: '#FFFFFF',
             bold: true },
           { text: 'Grow a 3rd ear in the Winter',
             disabled: true,
             textSize: 20,
             style: { flex: 1, marginTop: 5, marginLeft: 5 } } ] },
      { id: 233,
        question: 'For how long is a dog pregnant?',
        options: [ '9 Months', '9 Weeks', '9 Days', '9 Fortnights' ],
        answer: '9 Weeks',
        category_id: 1,
        chosen: '9 Fortnights',
        _options:
         [ { text: '9 Months',
             disabled: true,
             textSize: 20,
             style: { marginBottom: 5, marginRight: 5 } },
           { text: '9 Weeks',
             disabled: true,
             textSize: 20,
             style: { marginBottom: 5, marginLeft: 5 },
             bgColour: '#5CB85C',
             textColour: '#FFFFFF',
             bold: true },
           { text: '9 Days',
             disabled: true,
             textSize: 20,
             style: { marginTop: 5, marginRight: 5 } },
           { text: '9 Fortnights',
             disabled: true,
             textSize: 20,
             style: { marginTop: 5, marginLeft: 5 },
             bgColour: '#D9534F',
             textColour: '#FFFFFF',
             bold: true } ] },
      { id: 258,
        question: 'Which of these antagonist characters was created by novelist J.K. Rowling?',
        options:
         [ 'Professor Moriarty ',
           'Darth Vader',
           'Lord Farqaad',
           'Lord Voldemort' ],
        answer: 'Lord Voldemort',
        category_id: 1,
        chosen: 'Professor Moriarty ',
        _options:
         [ { text: 'Professor Moriarty ',
             disabled: true,
             textSize: 20,
             style: { marginBottom: 5, marginRight: 5 },
             bgColour: '#D9534F',
             textColour: '#FFFFFF',
             bold: true },
           { text: 'Darth Vader',
             disabled: true,
             textSize: 20,
             style: { marginBottom: 5, marginLeft: 5 } },
           { text: 'Lord Farqaad',
             disabled: true,
             textSize: 20,
             style: { marginTop: 5, marginRight: 5 } },
           { text: 'Lord Voldemort',
             disabled: true,
             textSize: 20,
             style: { marginTop: 5, marginLeft: 5 },
             bgColour: '#5CB85C',
             textColour: '#FFFFFF',
             bold: true } ] }
    ];

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
