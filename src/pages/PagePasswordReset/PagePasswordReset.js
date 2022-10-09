import React, { Component } from 'react';
import { Button } from 'theme-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import emailDomain from 'constants/EmailDomain';
import AuthWrapper from 'components/AuthWrapper';
import Loading from 'components/Loading';
import Link from 'components/Link';

class PagePasswordReset extends Component {
  state = {
    confirmPassword: '',
    email: '',
    loading: false,
    error: '',
    password: '',
    sent: false,
  };

  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  // when the user submits their email, we send a password reset confirmation email
  onEmailFormSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true });

    const { auth, loginPath } = this.props;
    try {
      await auth().sendPasswordResetEmail(this.state.email, {
        url: `${emailDomain}${loginPath}`,
      });
      this.setState({ loading: false, sent: true });
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  };

  // this is the /reset path, this form gets the email of the user trying to reset their password
  renderEmailForm = () => {
    const { email, loading, error, sent } = this.state;
    return (
      <div>
        <AuthWrapper portal={this.props.portal}>
          <form onSubmit={this.onEmailFormSubmit}>
            <h1>Reset Password</h1>
            <br />
            {!sent ? (
              <div>
                <input
                  name="email"
                  onChange={this.handleChange}
                  placeholder="Email"
                  type="email"
                  value={email}
                />
                <br />
                <br />
                {loading ? (
                  <Loading style={{ height: 50 }} />
                ) : (
                  <Button variant="primary" type="submit">
                    Reset
                  </Button>
                )}
                <br />
                {error && (
                  <div className="Warning">
                    <br />
                    {error}
                  </div>
                )}
                <br />
              </div>
            ) : (
              <div>
                Sent reset link! Check your email! <br />
                <br />
              </div>
            )}
          </form>
        </AuthWrapper>
      </div>
    );
  };

  // after the user clicks on the password change confirmation email, this function is called when
  // the user submits their new password
  onPasswordFormSubmit = async event => {
    event.preventDefault();

    const { confirmPassword, password } = this.state;
    this.setState({ loading: true });

    // if passwords don't match, early return
    if (password !== confirmPassword) {
      this.setState({ loading: false, error: 'Passwords do not match' });
      return;
    }

    const { confirmPasswordReset, history, location } = this.props;
    const { continueUrl, oobCode } = queryString.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    // default continue path is /login
    let continuePath = '/login';
    if (continueUrl) {
      continuePath = continueUrl.split(emailDomain)[1];
    }

    try {
      await confirmPasswordReset(oobCode, password);
      alert('Password reset confirmed!');
      this.setState({ loading: false });
      history.push(continuePath);
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  };

  // this is the /auth path, after the user clicks on the password change confirmation email, we render a password change form
  renderPasswordForm = () => {
    const { confirmPassword, loading, error, password } = this.state;

    return (
      <AuthWrapper portal={this.props.portal}>
        <form onSubmit={this.onPasswordFormSubmit}>
          <h1>Reset Password</h1>
          <br />
          <input
            name="password"
            onChange={this.handleChange}
            placeholder="Password"
            type="password"
            value={password}
          />
          <br />
          <br />
          <input
            name="confirmPassword"
            onChange={this.handleChange}
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
          />
          <br />
          <br />
          {loading ? (
            <Loading style={{ height: 50 }} />
          ) : (
            <Button variant="primary" type="submit">
              Reset
            </Button>
          )}
          <br />
          {error && (
            <div className="Warning">
              <br />
              {error}
              <br />
            </div>
          )}
          <br />
        </form>
      </AuthWrapper>
    );
  };

  componentDidMount() {
    const { appPath, isLoggedIn, history } = this.props;

    // if someone is already logged in already, then redirect to whatever redirectURL (usually /app) passed in
    if (isLoggedIn) {
      history.push(appPath);
    }
  }

  render() {
    const { location, loginPath, registerPath, resetPath } = this.props;
    // render email form if the path is /reset (to send the password reset confirmation email)
    const isEmailForm = location.pathname === resetPath;

    return (
      <div className="PagePasswordReset">
        {isEmailForm ? this.renderEmailForm() : this.renderPasswordForm()}
        <div className="AuthLinks">
          <Link to={loginPath} fontWeight="default" color="text">
            Already have an account? Log in
          </Link>
          <br />
          <div style={{ height: 10 }} />
          <Link to={registerPath} fontWeight="default" color="text">
            Create an account
          </Link>
          <br />
        </div>
      </div>
    );
  }
}

// these are default props, aka if you don't pass any props in, these will be populated with these default values
PagePasswordReset.defaultProps = {
  appPath: '/app',
  loginPath: '/login',
  registerPath: '/register',
  resetPath: '/reset',
};

function mapStateToProps(state, props) {
  // Note: auth here isn't auth data but auth firebase functions
  const { auth, confirmPasswordReset } = props.firebase;
  return { auth, confirmPasswordReset, isLoggedIn: !!state.firebase.auth.uid };
}

export default compose(
  // to get firebase authentication functions (password reset, etc.)
  firebaseConnect(),
  // to change history with history.push
  withRouter,
  connect(mapStateToProps),
)(PagePasswordReset);
