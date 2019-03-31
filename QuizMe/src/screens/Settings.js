import React, { Component } from 'react';
import { Platform, View, StyleSheet, TouchableOpacity } from 'react-native';

import { Header, Text, Button, Input } from '../components/Core';
import { styles } from '../styles';
import { utils } from '../utils';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testValue: '8',
    }
  }

  whatIsValue() {
    console.log(utils);
    console.log(this.input.state.value);
    console.log(this.input.state.valid);
  }

  update(val) {
    this.setState({testValue: val});
  }

  render() {
    let { props, state } = this;

    return (
      <View>
        <Header title="Settings" route="Home"/>
        <View style={[styles.f1, styles.col, {alignItems: 'center'}]}>
          <Button style={styles.mt15} label="Test" icon="cog" onPress={() => {this.whatIsValue()}}/>
          <Input
            style={styles.mt15} icon="cog" label="Round Time (s)" value={state.testValue}
            type="int" ref={x => {this.input = x}} onChange={(val) => {this.update(val);}}
            validator={(v) => { return (3 <= v && v <= 300)}}
          />
        </View>
      </View>
    )
  }
}
