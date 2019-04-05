import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';

import { Container, Header, Text, Button, Input } from '../components/Core';
import { styles, colours, fonts } from '../styles';
import { utils } from '../utils';

class Game extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { props, state } = this;
    let turn = 1;

    return (
      <Container bgColor={colours.black} style={{padding: 30}}>
        <View style={styles.aCenter}>
          <Text color={colours.white} size={30} bold={true}>
            {'QUESTION ' + turn.toString()}
          </Text>
        </View>
        <View style={[styles.f1, styles.row, styles.aCenter]}>
          <Text color={colours.white} size={30} align={'center'}>
            {props.question.question}
          </Text>
        </View>
        <View style={[styles.f1, styles.col]} >
          <View style={[styles.f1, styles.row]}>
            <View style={[styles.option, {marginBottom: 5, marginRight: 5}]}>
              <Text size={24} align={'center'}>{props.question.options[0]}</Text>
            </View>
            <View style={[styles.option, {marginBottom: 5, marginLeft: 5}]}>
              <Text size={24} align={'center'}>{props.question.options[1]}</Text>
            </View>
          </View>
          <View style={[styles.f1, styles.row]}>
            <View style={[styles.option, {marginTop: 5, marginRight: 5}]}>
              <Text size={24} align={'center'}>{props.question.options[2]}</Text>
            </View>
            <View style={[styles.option, {marginTop: 5, marginLeft: 5}]}>
              <Text size={24} align={'center'}>{props.question.options[3]}</Text>
            </View>
          </View>
        </View>
      </Container>
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
