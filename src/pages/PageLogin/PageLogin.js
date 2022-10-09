/** @jsx jsx */

import { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { withRouter } from 'react-router-dom';
import { jsx, Button } from 'theme-ui';

import AuthWrapper from 'components/AuthWrapper';
import GoogleButton from 'components/GoogleButton';
import Link from 'components/Link';
import Loading from 'components/Loading';

class PageLogin extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', error: '', loading: false, password: '' };
  }

  // submit function for the form (login with email/password)
  onFormSubmit = event => {
    event.preventDefault();

    const { email, password } = this.state;
    this.setState({ loading: true });

    this.props.loginUser({ email, password }).catch(error => {
      this.setState({ error: error.message, loading: false });
    });
  };

  // login with Google SSO provider
  loginWithProvider = provider => {
    this.setState({ loading: true });

    this.props.loginUser({ provider }).catch(error => {
      this.setState({ error: error.message, loading: false });
    });
  };

  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value });

  render() {
    const {
      emailPlaceholder,
      history,
      isLoggedIn,
      portal,
      redirectURL,
      registerPath,
      resetPath,
      title,
    } = this.props;

    const { email, password } = this.state;

    // if someone is already logged in already, then redirect to whatever redirectURL (usually /app) passed in
    if (isLoggedIn) {
      history.push(redirectURL);
    }

    return (
      <div>
        <AuthWrapper portal={portal}>
          <form onSubmit={this.onFormSubmit}>
            <h1>{title}</h1>
            <br />
            <input
              name="email"
              onChange={this.handleChange}
              placeholder={emailPlaceholder}
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
            {!this.state.loading ? (
              <div>
                <Button type="submit" variant="primary">
                  Log In
                </Button>
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
                />
              </div>
            ) : (
              <Loading size={90} />
            )}
          </form>
        </AuthWrapper>
        <div className="AuthLinks">
          <Link to={registerPath} fontWeight="default" color="text">
            Create an account
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
PageLogin.defaultProps = {
  redirectURL: '/app',
  registerPath: '/register',
  resetPath: '/reset',
};

function mapStateToProps(state, props) {
  return {
    isLoggedIn: !!state.firebase.auth.uid,
    // reference: http://react-redux-firebase.com/docs/auth.html#parameters-for-login
    loginUser: props.firebase.login,
  };
}

export default compose(
  // to get firebase login function
  firebaseConnect(),
  // to change history with history.push
  withRouter,
  connect(mapStateToProps),
)(PageLogin);
