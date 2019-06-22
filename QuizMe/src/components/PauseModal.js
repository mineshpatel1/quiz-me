import React, { Component } from 'react';
import { View } from 'react-native';

import HandleBack from './HandleBack';
import NavigationService from '../nav/NavigationService';
import { Modal, Button } from './Core';
import { styles, colours } from '../styles';

export default class PauseModal extends Component {
  static defaultProps = {
    route: null,
    disabled: false,
    resumeLabel: 'Resume',
    resumeIcon: 'play',
    navLabel: 'Home',
    navIcon: 'home',
  }

  constructor(props) {
    super(props);

    this.state = {
      paused: false
    }
  }

  onBack = () => {
    this.pause();
    return true;
  }

  navigate = () => {
    if (this.props.route) {
      NavigationService.navigate(this.props.route);
    } else {
      NavigationService.back();
    }
  }

  pause = () => {
    if (this.props.disabled) {
      this.navigate();
    } else {
      this.setState({ paused: true });
    }
  }

  unpause = () => {
    this.setState({paused: false});
  }

  render() {
    let { props, state } = this;
    return (
      <HandleBack onBack={this.onBack}>
        <Modal
          theme={true} isVisible={state.paused} onCancel={this.unpause}
          style={[styles.center]}
        >
          <View>
            <Button
              width={220} label={props.resumeLabel} icon={props.resumeIcon} 
              borderColour={colours.primaryDark} onPress={() => {
                this.unpause();
              }}
            />
            <Button
              style={styles.mt15} width={220} label={props.navLabel} icon={props.navIcon}
              borderColour={colours.primaryDark} onPress={() => {
                this.unpause();
                this.navigate();
              }}
            />
          </View>
        </Modal>
      </HandleBack>
    )
  }
}

