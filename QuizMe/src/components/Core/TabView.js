import React, { Component } from 'react';
import { View } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import Text from './Text';
import { styles, fonts, colours } from '../../styles';

export default class _TabView extends Component {
  static defaultProps = {
    scenes: {},
    badges: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    }

    let routes = [];
    for (route in props.scenes) {
      routes.push({ key: route, title: route });
    }
    this.state.routes = routes;
  }

  render() {
    let { props } = this;
    let { otherProps, scenes } = props;
    return (
      <TabView
        {...otherProps}
        navigationState={this.state}
        renderScene={SceneMap(scenes)}
        onIndexChange={index => this.setState({ index })}
        renderTabBar={props =>
          <TabBar
            {...props}
            style={{ height: 50, backgroundColor: colours.white }}
            indicatorStyle={{ backgroundColor: colours.primary }}
            labelStyle={[fonts.normal, { fontSize: 14, color: colours.grey }]}
            renderBadge={(route, p, i) => {
              let badge = this.props.badges[route.route.key];
              if (!(badge > 0)) return null;
              return (
                <View style={[styles.badge, {
                  position: 'absolute',
                  top: 16, right: 10,
                }]}>
                  <Text colour={colours.white} size={10}>{badge}</Text>
                </View>
              )
            }}
          />
        }
      />
    )
  }
}