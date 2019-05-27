import React, { Component } from 'react';
import { View, ScrollView, TouchableWithoutFeedback } from 'react-native';

import Text from './Text';
import Icon from './Icon';
import Checkbox from './Checkbox';
import Modal from './Modal';
import ConfirmButtons from './ConfirmButtons';
import { styles, colours } from '../../styles';
import { utils } from '../../utils';

export default class MultiPickerModal extends Component {
  static defaultProps = {
    values: [],
    options: [],
    isVisible: false,
    width: 350,
    height: 350,
    borderRadius: 50,
    colour: colours.primary,
    textColour: colours.white,
    fontSize: 20,
    bold: true,
    activeOpacity: 0.85,
    padding: 20,
    onSuccess: null,
    onReject: null,
    onCancel: null,
    btnWidth: 80,
  }

  constructor(props) {
    super(props);
    this.state = {
      values: props.values,
      modal: false,
    }
  }

  update = newVals => {
    this.setState({ values: newVals });
  }

  render() {
    let { state, props } = this;
    let options = [];

    props.options.forEach((opt, i) => {
      let bbw = 1;
      if (props.options.length == (i + 1)) bbw = 0;
      options.push({
        value: opt,
        bbw: bbw,
      })
    });

    return (
      <Modal
        theme={true} isVisible={this.props.isVisible} onCancel={() => { props.onCancel() }}
        style={[styles.center]} animationIn={'fadeInUp'} animationOut={'fadeOutDown'}
        width={props.width} height={props.height} paddingBottom={0} sidePadding={0} closeBtn={false}
      >
        <ScrollView>
        {
          options.map((opt, i) => (
            <View key={i} style={[
              styles.center,
              {
                width: props.width, borderColor: colours.primaryLight, borderBottomWidth: opt.bbw,
              }
            ]}>
              <TouchableWithoutFeedback onPress={() => {
                if (this.checkboxes) this.checkboxes[i].toggle();
              }}>
                <View
                  style={[styles.row, styles.aCenter, {
                    width: props.width, paddingTop: props.padding, paddingBottom: props.padding,
                    paddingLeft: 10, paddingRight: 10, justifyContent: 'space-between',
                  }]}
                >
                  <Text 
                    align="left" colour={colours.white} bold={props.bold} size={props.fontSize}
                    style={{width: props.width - 50}}
                  >{opt.value}</Text>
                  <Checkbox
                    value={state.values.indexOf(opt.value) > -1}
                    onToggle={checkVal => {
                      let newVals = checkVal ? state.values.concat([opt.value]) : utils.removeFromArray(state.values, opt.value);
                      newVals = utils.unique(newVals);
                      this.setState({ values: newVals });
                    }}
                    ref={check => {
                      if (!this.checkboxes) this.checkboxes = {};
                      this.checkboxes[i] = check;
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          ))
        }
        </ScrollView>
        <View style={{width: '100%', padding: 15, borderTopWidth: 1, borderColor: colours.primaryLight}}>
          <ConfirmButtons
            justify="space-evenly"
            onSuccess={() => {
              if (props.onSuccess) props.onSuccess(state.values);
            }}
            onCancel={() => {
              if (props.onReject) return props.onReject();
              props.onCancel();
            }}
            width={props.btnWidth}
          />
        </View>
      </Modal>
    )
  }
}
