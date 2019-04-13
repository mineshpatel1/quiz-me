import React, { Component } from 'react';
import { Animated, View, Easing, } from 'react-native';
import { Svg, Path, G } from 'react-native-svg';

import { utils } from '../utils';
import { styles, colours } from '../styles';

export default class ProgressCircle extends Component {
  static defaultProps = {
    radius: 100,
    tintColour: colours.primary,
    rotation: 90,
    lineCap: 'butt',
    arcSweepAngle: 360,
  }

  circlePath(x, y, radius, startAngle, endAngle) {
    var start = utils.polarToCartesian(x, y, radius, endAngle * 0.9999);
    var end = utils.polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    var d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y];
    return d.join(' ');
  }

  clampFill = fill => Math.min(100, Math.max(0, fill));

  constructor(props) {
    super(props);
  }

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
        {children && <View style={childContainerStyle}>{children(fill)}</View>}
      </View>
    )
  }
}
