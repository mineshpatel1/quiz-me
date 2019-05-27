import React, { Component } from 'react';
import { Animated, TouchableWithoutFeedback, View } from 'react-native';

import Icon from './Icon';
import { styles, colours } from '../../styles';
import { utils } from '../../utils';

export default class Checkbox extends Component {
  static defaultProps = {
    value: false,
    selectedColour: colours.primary,
    unselectedColour: colours.white,
    selectedBorderColour: colours.white,
    unselectedBorderColour: colours.softGrey,
    icon: 'check',
    iconColour: colours.white,
    borderWidth: 0,
    borderRadius: 5,
    size: 30,
    onToggle: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      opacity: new Animated.Value(props.value ? 1 : 0),
    }
  }

  toggle = val => {
    let _val;
    if (val === true) _val = true;
    else if (val === false) _val = false;
    else _val = !this.state.value;

    utils.animate(this.state.opacity, _val ? 1 : 0, 200, () => {
      this.setState({ value: _val });
      if (this.props.onToggle) this.props.onToggle(this.state.value);
    });
  }
  
  render() {
    let { props, state } = this;
    let borderColour = state.value ? props.selectedBorderColour : props.unselectedBorderColour;
    let colour = state.value ? props.selectedColour : props.unselectedColour;
    return (
      <TouchableWithoutFeedback onPress={this.toggle}>
        <View 
          style={[styles.center, { 
            width: props.size, height: props.size, 
            borderRadius: props.borderRadius, 
            borderWidth: props.borderWidth, 
            borderColor: borderColour,
            backgroundColor: props.unselectedColour,
          }]}
        >
          {
            <Animated.View style={[styles.center, {
              width: props.size -8, height: props.size -8,
              backgroundColor: props.selectedColour,
              opacity: state.opacity,
            }]}>
              <Icon size={18} icon={props.icon} colour={props.iconColour} />
            </Animated.View>
          }
        </View>
      </TouchableWithoutFeedback>
    )
  }
}