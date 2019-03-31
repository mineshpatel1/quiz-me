import React, { Component } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';

import Icon from './Icon';
import Text from './Text';
import { styles, fonts, colours } from '../styles';

export default class Input extends Component {
  static defaultProps = {
    width: 300,
    height: 50,
    borderRadius: 50,
    color: colours.white,
    type: 'default',
    onChange: null,
    validator: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      valid: this.validate(this.parseVal(props.value)),
    }
  }

  parseVal(newVal) {
    switch(this.props.type) {
      case 'default':
        return newVal;
      case 'numeric':
        newVal = Number(newVal);
        if (isNaN(newVal)) newVal = null;
        return newVal;
    }
  }

  validate(val) {
    if (this.props.validator) {
      return this.props.validator(val);
    } else {
      return true;
    }
  }

  update(newVal) {
    this.setState({ value: newVal, valid: this.validate(newVal) });
  }

  render() {
    let { props, state } = this;

    let value = null;
    if (state.value) {  // Even numeric inputs need strings
      value = state.value.toString();
    }

    let valid = true;
    let bg = colours.primary;
    if (!this.validate(this.parseVal(value))) bg = colours.error;

    return (
      <View style={[styles.shadow, styles.row,
        {
          width: props.width, height: props.height, borderRadius: props.borderRadius,
          backgroundColor: bg, alignItems: 'center',
        }, props.style,
      ]}>
        <TouchableOpacity
          onPress={() => { this.input.focus() }} activeOpacity={0.85}
          style={[styles.row, {
            flex: 4, borderTopLeftRadius: props.borderRadius, borderBottomLeftRadius: props.borderRadius,
          }]}
        >
          <View style={{paddingLeft: 20, width: 55, height: props.height, justifyContent: 'center'}}>
            <Icon icon={props.icon} name={props.icon} color={props.color} size={20} />
          </View>
          <View style={{flex: 1, height: props.height, justifyContent: 'center'}}>
            <Text bold={true} color={props.color}>{props.label}</Text>
          </View>
        </TouchableOpacity>
        <View style={{
          flex: 1, backgroundColor: colours.light, height: props.height,
          borderTopRightRadius: props.borderRadius, borderBottomRightRadius: props.borderRadius,
        }}>
          <TextInput
            style={[fonts.normal, {marginLeft: 15}]}
            keyboardType={props.type}
            value={value} ref={x => this.input = x}
            onChangeText={(val) => {
              val = this.parseVal(val);
              this.update(val);
              props.onChange(val);
            }}
          />
        </View>
      </View>
    )
  }
}
