import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Platform, View, YellowBox } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from "@react-native-community/netinfo";

import Header from './Header';
import StatusBar from './StatusBar';
import { setConnection } from '../../actions/SessionActions';
import { styles, colours } from '../../styles';
import { utils } from '../../utils';

class Container extends Component {
  static defaultProps = {
    bgColour: colours.white,
    spinner: false,
    onConnectionChange: null,
    header: null,
  }

  constructor(props) {
    super(props);

    // TODO: Remove this when react-navigation is updated
    // This will fire continually for Transitioner in react-navigation
    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
      'Warning: componentWillUpdate is deprecated',
    ]);
  }

  componentDidMount() {
    NetInfo.addEventListener('connectionChange', (info) => {
      this.onConnectionChange(info, this.is_online(info));
    });
  }

  componentWillUnmount() {
    NetInfo.removeEventListener('connectionChange', (info) => {
      this.onConnectionChange(info, this.is_online(info));
    });
  }

  is_online(info) {
    return ['none', 'unknown'].indexOf(info.type) == -1;
  }

  onConnectionChange(info, online) {
    this.props.setConnection(online);
    if (this.props.onConnectionChange) {
      this.props.onConnectionChange(info, online);
    }
  }

  render() {
    let { props } = this;
    let statusColour = props.bgColour == colours.white ? colours.primary : props.bgColour;
    let iosAdjust = Platform.OS == 'ios' && !props.header ? 25 : 0;

    let header = props.header;
    if (props.header && typeof(props.header) == 'string') {
      header = { title: props.header };
    }

    if (utils.isDark(statusColour)) {
      statusColour = utils.alterBrightness(statusColour, +50);
    } else {
      statusColour = utils.alterBrightness(statusColour, -50);
    }

    return (
      <View style={[styles.f1, { backgroundColor: props.bgColour, paddingTop: iosAdjust }, props.style]}>
        <StatusBar colour={statusColour} />
        <Spinner visible={props.spinner} color={colours.white} animation='fade' />
        {
          props.header &&
          <Header title={header.title} route={header.route} />
        }
        {props.children}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    online: state.session.online,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({setConnection}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Container);
