import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Platform, View, YellowBox } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from "@react-native-community/netinfo";

import Header from './Header';
import StatusBar from './StatusBar';
import { checkSession, setConnection } from '../../actions/SessionActions';
import { styles, colours } from '../../styles';
import { utils, api } from '../../utils';

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
      'Warning: ViewPagerAndroid has been extracted',
    ]);
  }

  componentDidMount() {
    NetInfo.addEventListener('connectionChange', (info) => {
      this.onConnectionChange(info, this.isOnline(info));
    });
  }

  componentWillUnmount() {
    NetInfo.removeEventListener('connectionChange', (info) => {
      this.onConnectionChange(info, this.isOnline(info));
    });
  }

  isOnline(info) {
    return ['none', 'unknown'].indexOf(info.type) == -1;
  }

  onConnectionChange(info, online) {
    let prevOnline = this.props.session.online;
    this.props.setConnection(online);
    if (!prevOnline && online) {
      this.props.checkSession().catch(err => console.log('Session check error: ', err));
    }
    if (this.props.onConnectionChange) this.props.onConnectionChange(info, online);
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
    session: state.session,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({setConnection, checkSession}, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Container);
