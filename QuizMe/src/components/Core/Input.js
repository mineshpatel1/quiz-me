import React, { Component } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';

import Icon from './Icon';
import Text from './Text';
import { styles, fonts, colours } from '../../styles';
import { utils } from '../../utils';

export default class Input extends Component {
  static defaultProps = {
    width: 300,
    height: 50,
    borderRadius: 50,
    colour: colours.white,
    type: 'default',
    onChange: null,
    validator: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      valid: this.validate(this.parseVal(props.value)),
      pristine: true,
    }
  }

  onFocus() {
    this.setState({ pristine: false });
  }

  onChange(val) {
    let _val = this.parseVal(val);
    let _valid = this.validate(_val);
    this.update(_val, _valid);
    if (this.props.onChange) this.props.onChange(_val, _valid);
  }

  parseVal(val) {
    if (!val) return null;
    return utils.parseValue(val, this.props.type);
  }

  validate(val) {
    if (this.props.validator) {
      return this.props.validator(val);
    } else {
      return true;
    }
  }

  update(newVal, newValid) {
    this.setState({ value: newVal, valid: newValid, pristine: false });
  }

  getKeyboardType(type) {
    switch (type) {
      case 'int':
        return 'numeric';
      case 'number':
        return 'numeric';
      default:
        return 'default';
    }
  }

  render() {
    let { props, state } = this;

    let keyboardType = this.getKeyboardType(props.type);
    let labelWidth = 1;
    let inputWidth = 4;

    if (keyboardType == 'numeric') {
      labelWidth = 4;
      inputWidth = 1;
    }

    let value = null;
    let showLabel = false;
    let inputColour = colours.grey;

    if (state.value) {  // Even numeric inputs need strings
      value = state.value.toString();
    } else if (keyboardType == 'default' && state.pristine) {
      showLabel = true;
      value = props.label;
      inputColour = colours.lightGrey;
    }

    let valid = true;
    let bg = colours.primary;
    if (!this.validate(this.parseVal(value))) bg = colours.error;

    return (
      <View style={[styles.shadow, styles.row, styles.aCenter,
        {
          width: props.width, height: props.height, borderRadius: props.borderRadius,
          backgroundColor: bg,
        }, props.style,
      ]}>
        <TouchableOpacity
          onPress={() => { this.input.focus(); }} activeOpacity={0.85}
          style={[styles.row, {
            flex: labelWidth, borderTopLeftRadius: props.borderRadius, borderBottomLeftRadius: props.borderRadius,
          }]}
        >
          <View style={{paddingLeft: 20, width: 55, height: props.height, justifyContent: 'center'}}>
            <Icon icon={props.icon} name={props.icon} colour={props.colour} size={20} />
          </View>
          {
            keyboardType == 'numeric' &&
            <View style={{flex: 1, height: props.height, justifyContent: 'center'}}>
              <Text bold={true} colour={props.colour}>{props.label}</Text>
            </View>
          }
        </TouchableOpacity>
        <View style={[styles.jCenter, {
          flex: inputWidth, backgroundColor: colours.light, height: props.height,
          borderTopRightRadius: props.borderRadius, borderBottomRightRadius: props.borderRadius,
        }]}>
          <TextInput
            style={[fonts.normal, {marginLeft: 15, color: inputColour}]}
            keyboardType={keyboardType}
            value={value} ref={x => this.input = x}
            onChangeText={(val) => this.onChange(val)}
            onFocus={() => { if (showLabel) this.onFocus() }}
          />
        </View>
      </View>
    )
  }
}
