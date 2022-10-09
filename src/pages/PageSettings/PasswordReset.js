/** @jsx jsx */

import { Component } from 'react';
import { jsx } from 'theme-ui';
import Input from 'components/Input';
import { Button } from 'theme-ui';

import { passwordResetSx } from 'pages/PageSettings/PageSettingsStyles';

export default class PageSettingsLayout extends Component {
  constructor(props) {
    super(props);
    this.state = { oldPassword: '', newPassword: '', confirmNew: '' };
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  resetOldPasswordField = () => this.setState({ oldPassword: '' });

  resetNewPasswordFields = () =>
    this.setState({
      newPassword: '',
      confirmNew: '',
    });

  updatePassword = () => {
    const { auth, reauthenticate } = this.props;
    const { oldPassword, newPassword, confirmNew } = this.state;
    if (newPassword !== confirmNew) {
      alert(
        'PASSWORD RESET FAILED: Confirm new password does not match new password.',
      );
      this.resetNewPasswordFields();
    } else {
      reauthenticate(oldPassword)
        .then(() => {
          auth()
            .currentUser.updatePassword(newPassword)
            .then(() => {
              alert('Password Reset!');
              this.resetOldPasswordField();
              this.resetNewPasswordFields();
            })
            .catch(error => {
              alert('PASSWORD RESET FAILED: ' + error.message);
              this.resetNewPasswordFields();
            });
        })
        .catch(() => {
          alert('PASSWORD RESET FAILED: Old password is wrong.');
          this.resetOldPasswordField();
        });
    }
  };

  render() {
    return (
      <div sx={passwordResetSx}>
        <h5>Reset Password</h5>
        <div>
          <Input
            autocomplete="off"
            handleInputChange={this.handleInputChange}
            name="oldPassword"
            placeholder="Type old password"
            type="password"
            value={this.state.oldPassword}
          />
          <br />
          <Input
            autocomplete="off"
            handleInputChange={this.handleInputChange}
            name="newPassword"
            placeholder="Type new password"
            type="password"
            value={this.state.newPassword}
          />
          <br />
          <Input
            autocomplete="off"
            handleInputChange={this.handleInputChange}
            name="confirmNew"
            placeholder="Confirm new password"
            type="password"
            value={this.state.confirmNew}
          />
          <Button
            onClick={() => this.updatePassword()}
            style={{
              marginTop: 20,
              marginBottom: 0,
            }}
          >
            Change password
          </Button>
        </div>
      </div>
    );
  }
}
