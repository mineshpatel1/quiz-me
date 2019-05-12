import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Biometrics from 'react-native-biometrics';

import { setSession, deleteAccount } from '../actions/SessionActions';
import { Container, Menu, ConfirmModal, SnackBar } from '../components/Core';
import { api } from '../utils';
import utils from '../utils/utils';

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
    this.setState({ loading: true });
    Biometrics.createKeys('Confirm fingerprint')
      .then(publicKey => {
        api.enableFingerprint(publicKey)
          .then(res => { 
            this.props.setSession(res);
            utils.persistStore('fingerprintEnabled', true);
            this.showSuccess("Registered fingerprint.");
          })
          .catch(err => this.showError(err));
      })
  }

  disableFingerprint() {
    this.setState({ loading: true });
    Biometrics.deleteKeys()
      .then(success => {
        if (!success) return this.showError("Could not delete fingerprint keys.");
        api.disableFingerprint()
          .then(res => {
            this.props.setSession(res);
            utils.persistStore('fingerprintEnabled', false);
            this.showSuccess("Disabled fingerprint.");
          })
          .catch(err => this.showError(err));
      })
      .catch(err => this.showError(err));
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

    if (state.supportsFingerprint && props.session.user && !props.session.user.fingerprint_enabled) {
      menu.push({ label: 'Enable Fingerprint Login', icon: 'fingerprint', onPress: () => this.enableFingerprint() })
    } else {
      menu.push({ label: 'Disable Fingerprint Login', icon: 'fingerprint', onPress: () => this.disableFingerprint() })
    }

    menu.push({ label: 'Delete Account', icon: 'times', onPress: () => this.setState({deleteModal: true}) });

    return (
      <Container header="Settings">
        <ConfirmModal 
          isVisible={state.deleteModal}
          onSuccess={() => this.deleteAccount()}
          onCancel={() => this.cancelDelete()}
          message={
            "Deleting your account will remove all data forever.\n\nAre you sure you want to delete your account?"
          }
        />
        <Menu menu={menu} />
        <SnackBar ref="error" error={true} onAction={() => this.setState({loading: false})} />
        <SnackBar 
          ref="success" success={true} 
          onAction={() => this.setState({loading: false})}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return { session: state.session }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setSession, deleteAccount
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
