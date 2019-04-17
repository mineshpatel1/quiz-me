import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';

import Option from '../components/Option';
import { Container, Text, Icon, Button } from '../components/Core';
import { styles, colours } from '../styles';

export default class GameSummary extends Component {
  render() {
    let idx = 0;
    let question = "Why is Arathi such a Poopypants?";
    let options = [
      "Because she's racist",
      "Because she doesn't understand the toilet",
      "Because she watches redundant trailers",
      "Because she's a fool!",
    ];
    return (
      <Container bgColour={colours.black}>
        <View style={[styles.row]}>
          <View style={[styles.f1, styles.row, {justifyContent: 'flex-end', padding: 30}]}>
            <TouchableOpacity onPress={() => {console.log('Close')}}>
              <Icon icon='times' colour={colours.white} size={24} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.f1, styles.row, {marginBottom: 10}]}>
          <View style={[styles.col, styles.center, {width: 45}]}>
            <Icon icon='chevron-left' colour={colours.white} />
          </View>
          <View style={[styles.f1, {
            marginTop: 0, borderWidth: 2,
            padding: 15, borderColor: colours.midGrey,
          }]}>
            <View style={[styles.f1, styles.row, styles.aCenter]}>
              <Text colour={colours.white} size={26} align={'center'}>
                {question}
              </Text>
            </View>
            <View style={[styles.f1, styles.col]} >
              <View style={[styles.f1, styles.row]}>
                <Option text={options[0]} disabled={true} textSize={20} style={[{marginBottom: 5, marginRight: 5}]} />
                <Option text={options[1]} disabled={true} textSize={20} style={[{marginBottom: 5, marginLeft: 5}]} />
              </View>
              <View style={[styles.f1, styles.row]}>
                <Option text={options[2]} disabled={true} textSize={20} style={[{marginTop: 5, marginRight: 5}]} />
                <Option text={options[3]} disabled={true} textSize={20} style={[{marginTop: 5, marginLeft: 5}]} />
              </View>
            </View>
          </View>
          <View style={[styles.col, styles.center, {width: 45}]}>
            <Icon icon='chevron-right' colour={colours.white} />
          </View>
        </View>
        <View style={[styles.row, styles.center]}>
          <Text colour={colours.white}>{"1/10"}</Text>
        </View>
      </Container>
    )
  }
}
