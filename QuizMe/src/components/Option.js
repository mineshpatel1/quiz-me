import React, { Component } from 'react';
import { Animated, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import { Text } from './Core';
import { styles, colours } from '../styles';
import { utils } from '../utils';
import { animationDuration } from '../config';

export default class Option extends Component {
  static defaultProps = {
    text: "",
    bgColour: colours.white,
    textColour: colours.black,
    bgHighlight: colours.black,
    textHighlight: colours.white,
    onPress: null,
    duration: animationDuration,
    disabled: false,
    textSize: 24,
  }

  constructor(props) {
    super(props);
    this.state = {
      colour: new Animated.Value(0),
      bold: false,
    }
  }

  reset() {
    this.setState({bold: false});
    utils.animate(this.state.colour, 0, 0);
  }

  highlight(callback=null) {
    utils.animate(this.state.colour, 1, this.props.duration, () => {
      this.setState({bold: true});
      if (callback) callback();
    });
  }

  render() {
    let { props, state } = this;
    console.log(props.text.length);

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (!props.disabled) {
            this.highlight();
            if (props.onPress) props.onPress();
          }
        }}
      >
        <Animated.View style={[{
          backgroundColor: state.colour.interpolate({
            inputRange: [0, 1],
            outputRange: [props.bgColour, props.bgHighlight],
          })}, styles.option, props.style]}>
          <Text
            animated={true} size={props.textSize} align={'center'} bold={state.bold}
            colour={state.colour.interpolate({
              inputRange: [0, 1],
              outputRange: [props.textColour, props.textHighlight]
            })}
          >
            {props.text}
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}
