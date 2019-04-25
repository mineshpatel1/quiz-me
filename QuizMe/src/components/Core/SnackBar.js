import React, { Component } from "react";
import { StyleSheet, View, Animated, TouchableOpacity } from "react-native";

import Text from './Text';
import { animationDuration } from '../../config';
import { styles, colours } from '../../styles';
import utils from "../../utils/utils";

export default class SnackBar extends Component {
  static defaultProps = {
    colour: colours.grey,
    textColour: colours.white,
    actionColour: colours.primary,
    actionText: "OK",
    textSize: 18,
    duration: 3000,
    height: 80,
    onAction: null,
    error: false,
    success: false,
    onAutoHide: null,
  }

  constructor(props) {
    super();

    this.yPos = new Animated.Value(props.height);
    this.shown = false;
    this.hidden = true;
    this.state = {
      msg: ''
    };
  }

  show(msg="Default SnackBar Message...", duration=null) {
    if (duration == null) duration = this.props.duration;
    if ( this.shown === false ) {
      this.setState({ msg: msg });
      this.shown = true;

      utils.animate(this.yPos, 0, null, () => {
        this.hidden = false;
        this.autoHide(duration);
      });
    }
  }

  autoHide = (duration) => {
    if (duration > 0) {
      this.timer = setTimeout(() => {
        if (!this.hidden) {
          this.hidden = false;
          utils.animate(this.yPos, this.props.height, null, () => {
            this.hidden = true;
            this.shown = false;
            clearTimeout(this.timer);
            if (this.props.onAutoHide) this.props.onAutoHide();
          });
        }
      }, duration);
    }
  }

  close = () => {
    if (this.shown) {
      this.hidden = false;
      clearTimeout(this.timer);
      utils.animate(this.yPos, this.props.height, null, () => {
        this.shown = false;
        this.hidden = true;
      });
    }
  }

  render() {
    let { props, state } = this;

    let colour = props.colour;
    let textColour = props.textColour;
    let actionColour = props.actionColour;
    if (props.error || props.success) {
      textColour = colours.white;
      actionColour = colours.white;
    }
    
    if (props.error) colour = colours.error;
    if (props.success) colour = colours.success;

    return (
      <Animated.View style = {[
        { 
          transform: [{ translateY: this.yPos }], height: props.height,
          backgroundColor: colour,
        }, 
        styles.snackBarContainer,
      ]}>
        <Text numberOfLines = { 1 } colour={textColour} size={props.textSize}>
          { this.state.msg }
        </Text>
        <TouchableOpacity 
          activeOpacity={0.5} style={styles.snackAction}
          onPress = {() => {
            this.close();
            if (props.onAction) props.onAction();
          }}
        >
          <Text bold={true} colour={actionColour} size={props.textSize}>
            {props.actionText}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}