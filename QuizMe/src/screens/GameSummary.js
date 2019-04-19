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
      width: null,
    }
  }

  onLayout = (e) => {
    this.setState({width: e.nativeEvent.layout.width});
  }

  scroll(direction=1) {
    let newIdx = this.state.index + (1 * direction);
    this.setState({ index: newIdx });
    utils.animate(this.state.margin, this.state.width * newIdx);
  }

  right() { this.scroll() }
  left() {
    if (this.state.index > 0) this.scroll(-1);
  }

  render() {
    let { props, state } = this;
    console.log(props.game);

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
          <View onLayout={this.onLayout} style={[{width: '80%', overflow: 'hidden'}]}>
            <Animated.View style={[{
              marginTop: 0, borderWidth: 2, width: '100%', height: '100%',
              padding: 15, borderColor: colours.midGrey,
              transform: [{translateX: state.margin}],
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
            </Animated.View>
          </View>
          <View style={[styles.col, styles.center, {width: '10%'}]}>
            <TouchableOpacity onPress={() => this.right()}>
              <Icon icon='chevron-right' colour={colours.white} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.row, styles.center]}>
          <Text colour={colours.white}>{(state.index + 1).toString() + "/10"}</Text>
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
