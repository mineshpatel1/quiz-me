import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';

import { Container, Header, Text, Button, Input } from '../components/Core';
import { styles, colours } from '../styles';
import { utils } from '../utils';

class Game extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { props, state } = this;
    return (
      <Container>
        {/* <Header title={'New Game'} /> */}
        <View style={[styles.f1, styles.col, {alignItems: 'center'}]}>
          <Text>{props.question.question}</Text>
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
