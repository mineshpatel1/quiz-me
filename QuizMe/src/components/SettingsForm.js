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
  }

  render() {
    let { props, state } = this;
    let settings = defaultSettings;
    if (props.extraSettings) settings = utils.update(props.extraSettings, settings);
    return (
      <Form 
        fields={settings} values={props.settings} 
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
