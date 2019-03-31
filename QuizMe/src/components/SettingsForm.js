import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';

import ConfirmButtons from '../components/ConfirmButtons';
import { Button, Input } from '../components/Core';
import { styles, colours } from '../styles';
import { settings } from '../config';

export default class SettingsForm extends Component {
  constructor(props) {
    super();
    this.input = {};
  }

  test() {
    console.log(settings);
    console.log(this.input.roundTime.state.value);
    console.log(this.input.roundTime.state.valid);
  }

  render() {
    let _settings = [];  // Convert to array
    for (id in settings) {
      settings[id].id = id;
      _settings.push(settings[id]);
    }

    return (
      <View style={[styles.f1, {width: '100%'}]}>
        <View style={[
          styles.f1, {backgroundColor: colours.white, borderBottomWidth: 2, borderColor: colours.light}
        ]}>
          <ScrollView contentContainerStyle={{alignItems: 'center', paddingTop: 15}}>
            {
              _settings.map((setting, i) => (
                <Input
                  key={i} style={[{marginBottom: 15}]} icon={setting.icon} label={setting.label}
                  ref={x => {this.input[setting.id] = x}}
                  validator={setting.validator}
                />
              ))
            }
          </ScrollView>
        </View>
        <View style={[{
          justifyContent: 'flex-end', paddingTop: 15, paddingBottom: 15,
        }]}>
          <ConfirmButtons
            onSuccess={() => { console.log('Success'); }}
            onCancel={() => { console.log('Cancel'); }}
          />
        </View>
      </View>
    )
  }
}
