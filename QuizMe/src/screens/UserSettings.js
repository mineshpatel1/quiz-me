import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Biometrics from 'react-native-biometrics';

import { setSession, deleteAccount } from '../actions/SessionActions';
import { saveUserSettings } from '../actions/SettingActions';
import { Container, Menu, ConfirmModal, SnackBar } from '../components/Core';
import { api } from '../utils';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
      supportsFingerprint: false,
      loading: false,
    }
  }

  componentDidMount() {
    Biometrics.isSensorAvailable()
      .then((biometryType) => {
        console.log(biometryType);
        if (biometryType === Biometrics.TouchID) {
          this.setState({ supportsFingerprint: true });
        }
      });
  }

  showError(err) {
    this.setState({ loading: false });
    this.refs.error.show(err, 0);
  }

  showSuccess(msg) {
    this.setState({ loading: false });
    this.refs.success.show(msg, 0);
  }

  enableFingerprint() {
    this.setState({ loading: true }, () => {
      Biometrics.createKeys('Confirm fingerprint')
        .then(publicKey => {
          api.enableFingerprint(publicKey)
            .then(res => { 
              this.props.setSession(res);
              this.props.saveUserSettings({ fingerprint: this.props.session.user.id });
              this.showSuccess("Registered fingerprint.");
            })
            .catch(err => this.showError(err));
        });
    });
  }

  disableFingerprint() {
    this.setState({ loading: true }, () => {
      Biometrics.deleteKeys()
        .then(success => {
          if (!success) return this.showError("Could not delete fingerprint keys.");
          api.disableFingerprint()
            .then(res => {
              this.props.setSession(res);
              this.props.saveUserSettings({ fingerprint: null });
              this.showSuccess("Disabled fingerprint.");
            })
            .catch(err => this.showError(err));
        })
        .catch(err => this.showError(err));
    });
  }

  cancelDelete() {
    this.setState({ deleteModal: false });
  }

  deleteAccount() {
    this.props.deleteAccount()
      .then(() => {
        this.setState({deleteModal: false});
        this.props.navigation.navigate('Home');
      })
      .catch(err => this.showError(err));
  }

  render() {
    let { props, state } = this;

    let menu = [
      { label: 'Change Password', icon: 'lock', onPress: () => props.navigation.navigate('ResetPassword') },
    ];

    if (state.supportsFingerprint) {
      if (props.session.user && !props.session.user.fingerprint_enabled) {
        menu.push({ label: 'Enable Fingerprint Login', icon: 'fingerprint', onPress: () => this.enableFingerprint() })
      } else {
        menu.push({ label: 'Disable Fingerprint Login', icon: 'fingerprint', onPress: () => this.disableFingerprint() })
      }
    }

    menu.push({ label: 'Delete Account', icon: 'times', onPress: () => this.setState({deleteModal: true}) });

    return (
      <Container header="Settings" spinner={state.loading}>
        <ConfirmModal 
          isVisible={state.deleteModal}
          onSuccess={() => this.deleteAccount()}
          onCancel={() => this.cancelDelete()}
          message={
            "Deleting your account will remove all data forever.\n\nAre you sure you want to delete your account?"
          }
        />
        <Menu menu={menu} />
        <SnackBar ref="error" error={true} />
        <SnackBar ref="success" success={true} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return { 
    session: state.session,
    settings: state.settings.user,
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setSession, deleteAccount, saveUserSettings
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
