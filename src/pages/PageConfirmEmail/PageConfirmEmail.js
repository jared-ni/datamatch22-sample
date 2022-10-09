import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { Button } from 'theme-ui';

import Link from 'components/Link';
import emailDomain from 'constants/EmailDomain';
import AuthWrapper from 'components/AuthWrapper';
import Loading from 'components/Loading';

class PageConfirmEmail extends Component {
  constructor(props) {
    super(props);

    const { appPath, email, location } = props;
    const isConfirmationLink = location.pathname !== appPath;

    // grab continueURL and oobCode if they exist on the email confirmation link
    const { continueUrl, oobCode } = queryString.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    this.state = {
      continueUrl,
      error: isConfirmationLink
        ? 'Verifying your email...'
        : `A verification email has been sent to your email address, ${email}. If you don't see it, check your spam folder.`,
      isConfirmationLink,
      loading: false,
      oobCode,
      resent: false,
      verified: false,
    };
  }

  // this resends the confirmation email
  resendConfirmationEmail = async () => {
    const { appPath, auth } = this.props;
    this.setState({ loading: true });

    try {
      await auth().currentUser.sendEmailVerification({
        url: `${emailDomain}${appPath}`,
      });
      this.setState({
        error:
          'Verification email resent. Please check your inbox and your spam folder.',
        loading: false,
        resent: true,
      });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  // this renders the resend confirmation email button OR a link to the app page
  renderButton = () => {
    const { isConfirmationLink, loading, resent, verified } = this.state;

    if (loading) {
      return <Loading size={64} />;
    }

    // if email was verified, then we give them a link to click to get to the main app
    if (verified) {
      const { continueUrl } = this.state;
      let continuePath = '/app';
      if (continueUrl) {
        continuePath = continueUrl.split(emailDomain)[1];
      }

      // the reason why we use a HREF here is because we need to refresh the page to repull the firebase authentication object
      return (
        <div>
          <a
            href={continuePath}
            style={{
              fontFamily: 'apercu',
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            Click here to get started!
          </a>
        </div>
      );
    }

    // if we haven't resent a confirmation email, we don't show the button anymore
    if (!isConfirmationLink && !resent) {
      return (
        <Button variant="primary" onClick={this.resendConfirmationEmail}>
          Resend verification email
        </Button>
      );
    }
  };

  // redirect user if they are already logged in/verified their email
  redirect = () => {
    const {
      appPath,
      emailVerified,
      history,
      isLoggedIn,
      loginPath,
    } = this.props;

    // if a user isn't logged in and the URL doesn't look like a email confirmation link, redirect to login page
    if (!isLoggedIn && !this.state.isConfirmationLink) {
      history.push(loginPath);
      return true;
    }

    // if a user is logged in and email is verified, redirect to app page
    if (isLoggedIn && emailVerified) {
      history.push(appPath);
      return true;
    }

    return false;
  };

  // verify email with the oobCode from the confirmation link
  verifyEmail = async () => {
    try {
      await this.props.auth().applyActionCode(this.state.oobCode);
      this.setState({ error: 'Verified!', verified: true });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  componentDidMount() {
    // try to redirect user on component load
    if (this.redirect()) {
      return;
    }

    // if we have a confirmation link, we try to verify the email
    if (this.state.isConfirmationLink) {
      this.verifyEmail();
    }
  }

  // if anything changed, try to redirect user
  componentDidUpdate() {
    this.redirect();
  }

  render() {
    const { isLoggedIn, logoutUser, portal, loginPath } = this.props;
    const { error } = this.state;

    return (
      <div className="PageConfirmEmail">
        <AuthWrapper portal={portal}>
          <h1>Confirm Your Email</h1>
          <br />
          <div>{error}</div>
          <br />
          <br />
          {this.renderButton()}
          <br />
          <br />
        </AuthWrapper>

        {isLoggedIn && (
          <div className="AuthLinks">
            <Link
              to={loginPath}
              fontWeight="default"
              color="text"
              onClick={logoutUser}
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    );
  }
}

// these are default props, aka if you don't pass any props in, these will be populated with these default values
PageConfirmEmail.defaultProps = {
  appPath: '/app',
  loginPath: '/login',
};

function mapStateToProps(state, props) {
  const { auth, logout } = props.firebase;
  const { email, emailVerified, uid } = state.firebase.auth;

  return {
    auth,
    email,
    emailVerified,
    isLoggedIn: !!uid,
    logoutUser: logout,
  };
}

export default compose(
  // to get firebase authentication functions (confirm email, logout, etc.)
  firebaseConnect(),
  // to change history with history.push
  withRouter,
  connect(mapStateToProps),
)(PageConfirmEmail);
