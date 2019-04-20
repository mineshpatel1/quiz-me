import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, ScrollView } from 'react-native';

import ConfirmButtons from '../components/ConfirmButtons';
import { Button, Input, Picker } from '../components/Core';
import { saveSettings } from '../actions/SettingActions';
import { utils } from '../utils';
import { styles, colours } from '../styles';
import { defaultSettings } from '../config';


class SettingsForm extends Component {
  static defaultProps = {
    onSave: null,
    onCancel: null,
    save: true,
  }

  constructor(props) {
    super();
    this.input = {};
    this.state = {
      settings: {},
      valid: {},
    };

    for (param in defaultSettings) {
      this.state.settings[param] = props.settings[param];
      this.state.valid[param] = defaultSettings[param].validator(props.settings[param]);
    }
  }

  update(param, _val, _valid) {
    this.setState((prev) => {
      prev.settings[param] = _val;
      prev.valid[param] = _valid;
      return prev;
    });
  }

  render() {
    let { props, state } = this;
    let _settings = [];
    let _textInputs2 = [];
    let _pickers = [];
    let values = {};

    textInput = (i, setting) => {
      return (
        <Input
          key={i} style={[{marginBottom: 15}]} icon={setting.icon}
          value={props.settings[setting.param]} type={setting.type}
          validator={setting.validator} label={setting.label}
          onChange={(val, valid) => {this.update(setting.param, val, valid)}}
        />
      )
    }

    picker = (i, setting) => {
      return (
        <Picker
          key={i} style={[{marginBottom: 15}]} icon={setting.icon}
          value={props.settings[setting.param]} options={setting.options}
          onChange={(val) => {this.update(setting.param, val, true)}}
        />
      )
    }

    let i = 0;
    for (param in defaultSettings) {
      defaultSettings[param].param = param;
      values[param] = this.state.settings[param];

      let setting = defaultSettings[param];
      if (setting.inputType == 'textInput') {
        _settings.push(textInput(i, setting));
      } else if (setting.inputType == 'picker') {
        _settings.push(picker(i, setting));
      }
      i += 1;
    }
    let valid = Object.values(this.state.valid).every((x) => {return x});

    return (
      <View style={[styles.f1, {width: '100%'}]}>
        <View style={[
          styles.f1, {backgroundColor: colours.white, borderBottomWidth: 2, borderColor: colours.light}
        ]}>
          <ScrollView contentContainerStyle={{alignItems: 'center', paddingTop: 15}}>
            {
              _settings.map((setting, i) => {
                return setting;
              })
            }
          </ScrollView>
        </View>
        <View style={[{
          justifyContent: 'flex-end', paddingTop: 15, paddingBottom: 15,
        }]}>
          <ConfirmButtons
            onSuccess={() => {
              if (props.save) props.saveSettings(values);
              if (props.onSave) props.onSave(values);
            }}
            onCancel={props.onCancel}
            disabled={!valid}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings.settings,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    saveSettings,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SettingsForm);
