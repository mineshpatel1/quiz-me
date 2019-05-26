import React, { Component } from 'react';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import { fonts, colours } from '../../styles';

export default class _TabView extends Component {
  static defaultProps = {
    scenes: {},
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
            style={{ backgroundColor: colours.white }}
            indicatorStyle={{ backgroundColor: colours.primary }}
            labelStyle={[fonts.normal, { fontSize: 14, color: colours.grey }]}
          />
        }
      />
    )
  }
}