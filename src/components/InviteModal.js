/** @jsx jsx */

import { Component, Fragment } from 'react';
import { firebaseConnect } from 'react-redux-firebase';
import { jsx, Button } from 'theme-ui';

import Input from 'components/Input';

const inviteModalSx = {
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: ['80%', '60%', '50%'],
  zIndex: '100',
  position: 'absolute',
  borderRadius: '8px',
  margin: 'auto',
  backgroundColor: theme => theme.colors.background,
  padding: '2em',

  '.sub-label': {
    marginBottom: '1em',
  },

  '.error': {
    color: theme => theme.colors.red,
    marginBottom: '1em',
  },

  '.background-border': {
    background: 'white',
    border: theme => `0.5px solid ${theme.colors.mediumGrey}`,
    boxSizing: 'border-box',
    borderRadius: '3px',
  },
  '.profile-input': {
    textAlign: 'left',
    width: '267px',
    height: '33px',
    marginBottom: '12px',
    padding: '1px 10px 1px 10px',
    color: 'black',
    fontSize: '14px',
  },
};

class InviteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      submitted: false,
      error: null,
      success: false,
    };
  }

  checkEmailExists = async email => {
    const encodedEmail = email.toLowerCase().replace(/\./g, ',');
    const snapshot = await this.props.firebase
      .database()
      .ref(`emailToName/${encodedEmail}`)
      .once('value');
    return snapshot.exists();
  };

  onFormSubmit = async e => {
    e.preventDefault();
    if (this.state.name && this.state.email) {
      const emailExists = await this.checkEmailExists(this.state.email);
      if (!emailExists) {
        this.props.firebase.functions().httpsCallable('email-inviteSearch')({
          invitedUserEmail: this.state.email.toLowerCase(),
          invitedUserName: this.state.name,
        });
        this.setState({ submitted: true, error: null, success: true });
      } else {
        this.setState({
          error:
            'They have already signed up for Datamatch! Feel free to search match them once results are out ;)',
          name: '',
          email: '',
        });
      }
    } else {
      this.setState({
        error: 'You need to actually give us a name and email!',
      });
    }
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  renderForm = () => {
    const { name, email, success, error } = this.state;

    if (success) {
      return <div>We've sent them an email, thanks!</div>;
    } else {
      return (
        <Fragment>
          <div className="main-label">
            <h4>
              Want to invite a friend or a crush (or a friend crush!) to
              Datamatch?
            </h4>
          </div>
          <div className="sub-label">They will not know who invited them!!</div>
          <Input
            className="profile-input background-border"
            handleInputChange={this.onInputChange}
            name="name"
            placeholder="Their First Name"
            type="text"
            value={name}
          />
          <Input
            className="profile-input background-border"
            handleInputChange={this.onInputChange}
            name="email"
            placeholder="Their Email"
            type="email"
            value={email}
          />
          <div>
            {error && <div className="error">{error}</div>}
            <Button
              className="submit-button"
              type="submit"
              onClick={this.onFormSubmit}
            >
              Submit
            </Button>
          </div>
        </Fragment>
      );
    }
  };

  render() {
    return <div sx={inviteModalSx}>{this.renderForm()}</div>;
  }
}

export default firebaseConnect()(InviteModal);
