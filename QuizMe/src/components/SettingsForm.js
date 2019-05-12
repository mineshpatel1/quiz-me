import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Form } from '../components/Core';
import { saveGameSettings } from '../actions/SettingActions';
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
          if (props.save) props.saveGameSettings(values);
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
    saveGameSettings,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SettingsForm);
