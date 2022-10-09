/** @jsx jsx */

import { Component } from 'react';
import { jsx } from 'theme-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import Modal from 'react-bootstrap/Modal';
import { Button, Close } from 'theme-ui';

import Container from 'components/Container';
import Header from 'components/Header';
import Input from 'components/Input';
import Link from 'components/Link';
import PasswordReset from 'pages/PageSettings/PasswordReset';
import { Mixpanel } from 'utils/mixpanel';
import { updateProfiles } from 'utils/updateProfiles';
import { college_to_email } from 'constants/config.json';

import { pageSettingsSx } from 'pages/PageSettings/PageSettingsStyles';

class PageSettings extends Component {
  state = {
    blockeeEmail: '',
    error: false,
    errorMsg: '',
    password: '',
    saved: false,
    show: false,
  };

  componentDidMount() {
    // Web analytics
    Mixpanel.track('Settings_Page', {});
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    // reset error and saved here to get rid of additional text
    this.setState({ [name]: value, error: false, saved: false });
  };

  // reauthenticate if google sign-in or show modal if password sign-in
  preDelete = async providerId => {
    if (providerId === 'password') {
      this.setState({ show: true });
    } else if (providerId === 'google.com') {
      const { auth, firebase } = this.props;
      const currentUser = auth().currentUser;
      const provider = new firebase.auth.GoogleAuthProvider();
      let credential;

      // get credentials
      await auth()
        .signInWithPopup(provider)
        .then(result => {
          credential = result.credential;
        })
        .catch(() => alert('Reauthentication failed.'));

      // reauthenticate with credential
      currentUser
        .reauthenticateWithCredential(credential)
        .then(() => this.setState({ show: true }))
        .catch(() => alert('Reauthentication failed.'));
    }
  };

  // delete user (after reauthenticating if password sign-in)
  deleteUser = async providerId => {
    const { deleteUser, reauthenticate } = this.props;
    if (providerId === 'password') {
      reauthenticate(this.state.password)
        .then(() => {
          deleteUser();
        })
        .catch(() => {
          alert('Incorrect password');
          this.setState({ password: '' });
        });
    } else if (providerId === 'google.com') {
      deleteUser();
    }
  };

  // remove user from blocklist
  removeBlockedUser = async (blocklist, key) => {
    const newBlocklist = blocklist.slice();
    newBlocklist.splice(key, 1);
    await this.props.updateProfile({ blocklist: newBlocklist });
    this.setState({ error: false, errorMsg: '', saved: true });
  };

  // add user to blocklist based on email input
  addToBlocklist = async () => {
    const blocklist = this.props.blocklist.slice();
    const blockeeEmail = this.state.blockeeEmail.toLowerCase().trim();

    let errorMsg = null;
    if (blockeeEmail === '') {
      errorMsg = 'Enter an email address!';
    } else if (blockeeEmail === this.props.email) {
      errorMsg = 'Cannot block yourself!';
    } else if (blocklist.length === 10) {
      errorMsg = 'Cannot block more than 10 people!';
    } else if (blocklist.indexOf(blockeeEmail) >= 0) {
      errorMsg = 'That person is already blocked!';
    }

    // check if valid email address
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!blockeeEmail.match(emailRegex)) {
      errorMsg = `${blockeeEmail} is not a valid email address.`;
    }

    // Check if email domain is valid college in database
    if (
      !Object.keys(college_to_email).find(school =>
        college_to_email[school].includes(
          blockeeEmail.substring(
            blockeeEmail.lastIndexOf('@') + 1,
            blockeeEmail.length,
          ),
        ),
      )
    ) {
      errorMsg = `Uh oh! ${blockeeEmail} is not a recognized college email.`;
    }

    // error found
    if (errorMsg) {
      this.setState({ error: true, errorMsg });
      return;
    }

    // no error!
    blocklist.push(blockeeEmail);
    await this.props.updateProfile({ blocklist });
    this.setState({
      blockeeEmail: '',
      error: false,
      errorMsg: '',
      saved: true,
    });
  };

  render() {
    const {
      auth,
      blocklist,
      reauthenticate,
      resetPassword,
      status,
    } = this.props;
    const { blockeeEmail, error, errorMsg, password, saved, show } = this.state;

    const currentUser = auth().currentUser;
    const providerId = currentUser.providerData[0].providerId; // `password` or `google.com`
    const hasPassword = currentUser.providerData.some(
      element => element.providerId === 'password',
    );

    const disableElements =
      status === 'live-processing' || status === 'live-matches';

    return (
      <div className="PageSettings" sx={pageSettingsSx}>
        <Header>Settings</Header>
        <h5>Blocklist</h5>
        <div>
          If you don't want to be matched with a particular person, type their
          email address here. You can block up to 10 people, and you can
          preemptively enter email addresses of people who are not in the
          database.
        </div>
        <br />
        <div className="blocklist-input-container">
          <Input
            className="blocklist-input"
            name="blockeeEmail"
            handleInputChange={this.handleInputChange}
            placeholder="Type an email"
            value={blockeeEmail}
          />
          <Button
            disabled={disableElements}
            className="block-btn"
            type="button"
            onClick={this.addToBlocklist}
            variant={disableElements ? 'disabled' : 'primary'}
          >
            Block
          </Button>
        </div>
        {error && (
          <div>
            <br />
            <p>
              <em>{errorMsg}</em>
            </p>
          </div>
        )}
        {saved && (
          <div>
            <br />
            <em>
              Your preferences have been saved. For more information, visit
              our&nbsp;
              <Link id="PolicyLink" to="/app/gender">
                matchmaking policy
              </Link>
              .
            </em>
          </div>
        )}
        <br />
        {blocklist.map((blockee, index) => {
          return (
            <div key={index} className="list-box">
              <div>
                <div id="email">{blockee}</div>
              </div>
              <Close
                className="delete"
                disabled={disableElements}
                onClick={() =>
                  !disableElements && this.removeBlockedUser(blocklist, index)
                }
                variant={disableElements ? 'disabled' : 'primary'}
              />
            </div>
          );
        })}
        <br />
        <Modal onHide={() => this.setState({ show: false })} show={show}>
          <Modal.Body style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 22 }}>
              Are you sure you want to delete your account? You will lose your
              survey results and matches.
            </div>
            <br />
            <br />
            {providerId === 'password' ? (
              // Only display if password sign-in
              <div>
                <Input
                  handleInputChange={this.handleInputChange}
                  name="password"
                  placeholder="Confirm your password to delete account"
                  type="password"
                  value={password}
                />
                <br />
              </div>
            ) : null}
            <Button onClick={() => this.deleteUser(providerId)}>
              I'm sure. Delete my account.
            </Button>
            <br />
            <br />
            <div
              onClick={() => this.setState({ show: false, password: '' })}
              style={{ cursor: 'pointer' }}
            >
              Just kidding!
            </div>
          </Modal.Body>
        </Modal>
        {hasPassword && (
          // Only display if user has setup password sign-in
          <div>
            <PasswordReset
              auth={auth}
              reauthenticate={reauthenticate}
              resetPassword={resetPassword}
            />
            <br />
            <br />
          </div>
        )}
        <div>
          <h5>Danger Zone</h5>
          <Button onClick={() => this.preDelete(providerId)}>
            Delete account
          </Button>
        </div>
        <div className="secondary-links">
          Read our:&nbsp;
          <Link to="/app/terms">Terms of Service</Link>&nbsp; • &nbsp;
          <Link to="/app/privacy">Privacy Policy</Link>&nbsp; • &nbsp;
          <Link to="/app/gender">Gender Policy</Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { auth, logout, ref, resetPassword } = props.firebase;
  const { email, uid } = state.firebase.auth;
  const user = auth().currentUser;
  const { blocklist } = state.firebase.data;

  return {
    auth,
    deleteUser: async () => {
      // remove database entry, delete user, and logout
      try {
        await ref(`/smallProfile/${uid}`).remove();
        await ref(`/publicProfile/${uid}`).remove();
        await ref(`/privateProfile/${uid}`).remove();
        await ref(`/emailToName/${email.replaceAll('.', ',')}`).remove();
        await ref(`/crushes/${uid}`).remove();
        await ref(`/responses/${uid}`).remove();
        await ref(`/searchIndex/${uid}`).remove();
        await user.delete();
        alert('Account Deleted :(');
        logout();
      } catch {
        alert('Delete failed.');
      }
    },
    email,
    blocklist: blocklist || [],
    reauthenticate: password => {
      const credential = auth.EmailAuthProvider.credential(email, password);
      return user.reauthenticateWithCredential(credential);
    },
    resetPassword,
    updateProfile: updateProfiles(props.firebase.update, uid, email),
  };
};

const WrappedPageSettings = ({ ...props }) => {
  return (
    <Container>
      <PageSettings {...props} />
    </Container>
  );
};

export default compose(
  firebaseConnect(props => [
    {
      path: '/privateProfile/' + props.uid + '/blocklist',
      storeAs: 'blocklist',
    },
  ]),
  connect(mapStateToProps),
)(WrappedPageSettings);
