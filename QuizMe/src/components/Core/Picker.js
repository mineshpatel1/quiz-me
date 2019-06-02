import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';

import Text from './Text';
import Icon from './Icon';
import Modal from './Modal';
import { styles, colours } from '../../styles';

export default class Picker extends Component {
  static defaultProps = {
    value: null,
    displayFn: val => { return val },
    onChange: null,
    options: [],
    width: 300,
    height: 50,
    borderRadius: 50,
    colour: colours.primary,
    textColour: colours.white,
    icon: 'th',
    activeOpacity: 0.85,
    padding: 20,
    label: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      modal: false,
    }
  }

  open() {
    this.setState({modal: true});
  }

  close() {
    this.setState({modal: false});
  }

  update(val) {
    this.setState({value: val, modal: false});
    if (this.props.onChange) this.props.onChange(val);
  }

  render() {
    let { state, props } = this;

    let options = [];
    let displayValue = state.value ? props.displayFn(state.value) : props.label;
    let textColour = state.value ? props.textColour : colours.primaryLight;
    props.options.forEach((opt, i) => {
      let bbw = 1;
      if (props.options.length == (i + 1)) bbw = 0;
      options.push({
        value: opt,
        bbw: bbw,
      })
    });

    return (
      <View style={[styles.shadow, styles.row, styles.aCenter,
        {
          width: props.width, height: props.height, borderRadius: props.borderRadius,
          backgroundColor: props.colour,
        }, props.style,
      ]}>
        <Modal
          theme={true} isVisible={this.state.modal} onCancel={() => { this.close() }}
          style={[styles.center]} animationIn={'fadeInUp'} animationOut={'fadeOutDown'}
          width={250} height={350} paddingBottom={0} sidePadding={0} closeBtn={false}
        >
          <ScrollView>
          {
            options.map((opt, i) => (
              <View key={i} style={[
                styles.center,
                {
                  width: 250, borderColor: colours.primaryLight, borderBottomWidth: opt.bbw,
                }
              ]}>
                <TouchableOpacity
                  activeOpacity={0.5} onPress={() => { this.update(opt.value) }}
                  style={[styles.center, {
                    width: 250, paddingTop: props.padding, paddingBottom: props.padding,
                  }]} >
                  <Text colour={colours.white} bold={true} size={20}>{props.displayFn(opt.value)}</Text>
                </TouchableOpacity>
              </View>
            ))
          }
          </ScrollView>
        </Modal>
        <TouchableOpacity
          onPress={() => { this.open() }} activeOpacity={props.activeOpacity}
          style={[styles.row, {
            flex: 4, borderTopLeftRadius: props.borderRadius, borderBottomLeftRadius: props.borderRadius,
          }]}
        >
          <View style={[styles.jCenter, {paddingLeft: 20, width: 55, height: props.height}]}>
            <Icon icon={props.icon} colour={props.textColour} size={20} />
          </View>
          <View style={{flex: 1, height: props.height, justifyContent: 'center'}}>
            <Text bold={true} colour={textColour}>{displayValue}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { this.open() }}
          activeOpacity={props.activeOpacity}
          style={{
            flex: 1, backgroundColor: colours.light, height: props.height,
            borderTopRightRadius: props.borderRadius, borderBottomRightRadius: props.borderRadius,
          }}
        >
          <View style={[styles.center, {width: 55, height: props.height}]}>
            <Icon icon="caret-down" colour={props.grey} size={20} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
