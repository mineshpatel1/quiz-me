import React, { Component } from 'react';
import { Animated, View, Easing, } from 'react-native';
import { Svg, Path, G } from 'react-native-svg';

import { Text } from './Core';
import { utils } from '../utils';
import { styles, colours } from '../styles';

class ProgressCircle extends Component {
  static defaultProps = {
    radius: 100,
    width: 5,
    tintColour: colours.primary,
    rotation: 0,
    lineCap: 'butt',
    arcSweepAngle: 360,
    textColour: colours.grey,
  }

  circlePath(x, y, radius, startAngle, endAngle) {
    var start = utils.polarToCartesian(x, y, radius, endAngle * 0.9999);
    var end = utils.polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    var d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y];
    return d.join(' ');
  }

  clampFill = fill => Math.min(100, Math.max(0, fill));

  render() {
    let { props } = this;
    const {
      radius, width, tintColour, bgColour, style, rotation, lineCap,
      arcSweepAngle, fill, children,
    } = props;
    let size = radius * 2;

    const backgroundPath = this.circlePath(
      size / 2, size / 2, size / 2 - width / 2, 0, arcSweepAngle
    );
    const circlePath = this.circlePath(
      size / 2, size / 2, size / 2 - width / 2, 0,
      (arcSweepAngle * this.clampFill(fill)) / 100
    );
    const offset = size - width * 2;

    const childContainerStyle = {
      position: 'absolute',
      left: width,
      top: width,
      width: offset,
      height: offset,
      borderRadius: offset / 2,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    };

    return (
      <View style={style}>
        <Svg width={size} height={size} style={{ backgroundColor: 'transparent' }}>
          <G rotation={rotation} originX={size / 2} originY={size / 2}>
            {bgColour && (
              <Path
                d={backgroundPath}
                stroke={bgColour}
                strokeWidth={width}
                strokeLinecap={lineCap}
                fill="transparent"
              />
            )}
            {fill > 0 && (
              <Path
                d={circlePath}
                stroke={tintColour}
                strokeWidth={width}
                strokeLinecap={lineCap}
                fill="transparent"
              />
            )}
          </G>
        </Svg>
        <View style={childContainerStyle}>
          <Text size={parseInt(radius / 3)}>
            {parseInt(fill).toString() + '%'}
          </Text>
        </View>
      </View>
    )
  }
}

const AnimatedProgress = Animated.createAnimatedComponent(ProgressCircle);
export default class AnimatedProgressCircle extends Component {

  static defaultProps = {
    duration: 500,
    easing: Easing.quad,
    minColour: colours.error,
    maxColour: colours.success,
  }

  constructor(props) {
    super(props);
    this.state = {
      fill: new Animated.Value(0),
      colour: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.animate();
  }

  animate(toVal, dur, ease) {
    const toValue = toVal >= 0 ? toVal : this.props.fill;
    const duration = dur || this.props.duration;
    const easing = ease || this.props.easing;

    Animated.timing(this.state.fill, {
      toValue, easing, duration,
    }).start();

    Animated.timing(this.state.colour, {
      toValue, easing, duration,
    }).start();
  }

  render() {
    let { state, props } = this;
    const { fill, ...other } = props;

    return (
      <AnimatedProgress
        {...other} fill={state.fill}
        tintColour={state.colour.interpolate({
          inputRange: [0, 100],
          outputRange: [props.minColour, props.maxColour],
        })}
      />
    );
  }
}
