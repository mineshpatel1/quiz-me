import React, { Component } from 'react';;
import { Platform, View, ScrollView } from 'react-native';

import ConfirmButtons from './ConfirmButtons';
import Input from './Input';
import Picker from './Picker';
import { styles, colours } from '../../styles';

export default class Form extends Component {
  static defaultProps = {
    values: {},
    fields: null,
    onSuccess: null,
    onCancel: null,
    disabled: false,
    successIcon: 'check',
    cancelIcon: 'times',
    onChange: null,
    width: '100%',
    inputWidth: 300,
    btnWidth: 120,
    divider: true,
  }

  constructor(props) {
    super();
    this.state = {
      values: {},
      valid: {},
    };

    for (param in props.fields) {
      this.state.values[param] = props.values[param];  // Current values
      this.state.valid[param] = props.fields[param].validator(props.values[param]);
    }
  }

  update(param, _val, _valid) {
    this.setState((prev) => {
      prev.values[param] = _val;
      prev.valid[param] = _valid;
      return prev;
    }, () => {
      if (this.props.onChange) this.props.onChange(this.state.values, this.state.valid);
    });
  }

  render() {
    let { props, state } = this;
    let fields = [];

    let iosAdjust = 0;
    if (Platform.OS == 'ios') iosAdjust = 15;

    textInput = (i, field) => {
      return (
        <Input
          key={i} style={[{marginBottom: 15}]} icon={field.icon}
          value={state.values[field.param]} type={field.type}
          validator={(val) => {
            return field.validator(val, state.values);
          }} label={field.label} secure={field.secure}
          onChange={(val, valid) => {this.update(field.param, val, valid)}}
          format={field.format} width={field.width}
        />
      )
    }

    picker = (i, field) => {
      return (
        <Picker
          key={i} style={[{marginBottom: 15}]} icon={field.icon}
          value={state.values[field.param]} options={field.options}
          onChange={(val) => {this.update(field.param, val, true)}}
          format={field.format} width={field.width}
        />
      )
    }

    let i = 0;
    for (param in props.fields) {
      let field = props.fields[param];
      field.param = param;
      field.width = props.inputWidth;
      if (field.inputType == 'text') {
        fields.push(textInput(i, field));
      } else if (field.inputType == 'picker') {
        fields.push(picker(i, field));
      }
      i += 1;
    }
    let valid = Object.values(state.valid).every((x) => {return x});
    let borderBottomWidth = props.divider ? 2 : 0;

    return (
      <View style={[styles.f1, {width: props.width}]}>
        <View style={[
          styles.f1, {borderBottomWidth: borderBottomWidth, borderColor: colours.light}
        ]}>
          <ScrollView contentContainerStyle={{alignItems: 'center', paddingTop: 15}}>
            {
              fields.map((field, i) => {
                return field;
              })
            }
            {
              props.children &&
              <View style={{ paddingBottom: 15 }}>
                { props.children }
              </View>
            }
          </ScrollView>
        </View>
        <View style={[{
          justifyContent: 'flex-end', paddingTop: 15, paddingBottom: 15 + iosAdjust,
        }]}>
          <ConfirmButtons
            onSuccess={() => {
              if (props.onSuccess) props.onSuccess(state.values);
            }}
            onCancel={props.onCancel}
            disabled={!valid || props.disabled}
            successIcon={props.successIcon}
            cancelIcon={props.cancelIcon}
            width={props.btnWidth}
          />
        </View>
      </View>
    )
  }
}