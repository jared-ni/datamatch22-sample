import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { withRouter } from 'react-router-dom';
import { Button } from 'theme-ui';

import emailDomain from 'constants/EmailDomain';
import AuthWrapper from 'components/AuthWrapper';
import GoogleButton from 'components/GoogleButton';
import Link from 'components/Link';
import Loading from 'components/Loading';

class PageRegister extends Component {
  state = {
    confirmPassword: '',
    email: '',
    loading: false,
    error: '',
    password: '',
  };

  // submit function for the register form
  onFormSubmit = async event => {
    event.preventDefault();

    const { confirmPassword, email, password } = this.state;
    this.setState({ loading: true });

    // prevent multiple accounts with the + character
    if (email.includes('+')) {
      this.setState({
        loading: false,
        error: "Invalid email, no '+' character allowed!",
      });
      return;
    }

    // if passwords don't match, early return
    if (password !== confirmPassword) {
      this.setState({ loading: false, error: 'Passwords do not match' });
      return;
    }

    // TODO: do we want to check if their email is a college email here?
    // actually register the user
    const { auth, redirectURL, registerUser } = this.props;
    try {
      // Pass in {} to prevent default of adding email to small profile
      await registerUser({ email: email.toLowerCase(), password }, {});
      // we have specific redirect URLs depending on which app/portal you are registering from
      await auth().currentUser.sendEmailVerification({
        url: `${emailDomain}${redirectURL}`,
      });
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
    this.setState({ loading: false });
  };

  // register with Google SSO provider
  loginWithProvider = provider => {
    this.setState({ loading: true });

    this.props.loginUser({ provider }).catch(error => {
      this.setState({ loading: false, error: error.message });
    });
  };

  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  render() {
    const {
      loginPath,
      portal,
      resetPath,
      isLoggedIn,
      history,
      redirectURL,
    } = this.props;
    const { confirmPassword, email, password } = this.state;

    // if someone is already logged in already, then redirect to whatever redirectURL (usually /app) passed in
    if (isLoggedIn) {
      history.push(redirectURL);
    }

    return (
      <div>
        <AuthWrapper portal={portal}>
          <form onSubmit={this.onFormSubmit}>
            <h1>Sign Up</h1>
            <br />
            <input
              name="email"
              onChange={this.handleChange}
              placeholder="College Email"
              type="email"
              value={email}
            />
            <br />
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
            {!this.state.loading ? (
              <div>
                <Button type="submit">Sign Up</Button>
                <br />
                {this.state.error && (
                  <div className="Warning">
                    <br />
                    {this.state.error}
                  </div>
                )}
                <hr />
                <GoogleButton
                  onClick={() => this.loginWithProvider('google')}
                  text="Sign up with Google"
                />
              </div>
            ) : (
              <Loading size={90} />
            )}
            <div style={{ textAlign: 'center' }}>
              By signing up you agree to the{' '}
              <Link to="/terms">Terms of Service</Link> and{' '}
              <Link to="/privacy">Privacy Policy</Link>.
            </div>
          </form>
        </AuthWrapper>
        <div className="AuthLinks">
          <Link to={loginPath} fontWeight="default" color="text">
            Already have an account? Log in
          </Link>
          <br />
          <div style={{ height: 10 }} />
          <Link to={resetPath} fontWeight="default" color="text">
            Forgot password? Reset it here!
          </Link>
          <br />
        </div>
      </div>
    );
  }
}

// these are default props, aka if you don't pass any props in, these will be populated with these default values
PageRegister.defaultProps = {
  loginPath: '/login',
  redirectURL: '/app',
  resetPath: '/reset',
};

function mapStateToProps(state, props) {
  // Note: auth here isn't auth data but auth firebase functions
  const { auth, createUser, login } = props.firebase;
  return {
    auth,
    isLoggedIn: !!state.firebase.auth.uid,
    loginUser: login,
    registerUser: createUser,
  };
}

export default compose(
  // to get firebase authentication functions (register, login, etc.)
  firebaseConnect(),
  // to change history with history.push
  withRouter,
  connect(mapStateToProps),
)(PageRegister);
