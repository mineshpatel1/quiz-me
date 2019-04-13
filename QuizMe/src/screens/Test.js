import React, { Component } from 'react';
import { Animated, Easing, View, TouchableOpacity } from 'react-native';

import { Container, Header, Text, Button, Input } from '../components/Core';
import ProgressCircle from '../components/ProgressCircle';
import { styles, colours, fonts } from '../styles';

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progressColour: new Animated.Value(0),
    }
  }

  render() {
    return (
      <View style={[styles.f1, styles.center]}>
        <ProgressCircle
          radius={100}
          width={5}
          fill={75}
          tintColor={'red'}
          rotation={0}
        >
          {
            (fill) => (
              <Text size={36}>
                {parseInt(fill).toString() + '%'}
              </Text>
            )
          }
        </ProgressCircle>
      </View>
    )
  }
}
