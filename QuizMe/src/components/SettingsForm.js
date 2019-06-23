import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Form } from '../components/Core';
import { saveGameSettings } from '../actions/SettingActions';
import { defaultSettings } from '../config';
import { utils } from '../utils';

class SettingsForm extends Component {
  static defaultProps = {
    onSave: null,
    onCancel: null,
    save: true,
    extraSettings: [],
    extraValues: [],
  }

  render() {
    let { props } = this;
    let settings = defaultSettings;
    let values = props.settings;
    if (props.extraSettings) settings = utils.update(props.extraSettings, settings);
    if (props.extraValues) values = utils.update(props.settings, props.extraValues);
    return (
      <Form 
        fields={settings} values={values} 
        onCancel={props.onCancel}
        onSuccess={(values) => {
          if (props.save) props.saveGameSettings(values);
          if (props.onSave) props.onSave(values);
        }}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings.game,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    saveGameSettings,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SettingsForm);
