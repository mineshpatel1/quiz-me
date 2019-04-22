import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Platform, View, ScrollView } from 'react-native';

import ConfirmButtons from '../components/ConfirmButtons';
import { Input, Picker, Form } from '../components/Core';
import { saveSettings } from '../actions/SettingActions';
import { styles, colours } from '../styles';
import { defaultSettings } from '../config';


class SettingsForm extends Component {
  static defaultProps = {
    onSave: null,
    onCancel: null,
    save: true,
  }

  render() {
    let { props, state } = this;
    return (
      <Form 
        fields={defaultSettings} values={props.settings} 
        onCancel={props.onCancel}
        onSuccess={(values) => {
          if (props.save) props.saveSettings(values);
          if (props.onSave) props.onSave(values);
        }}
      />
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
