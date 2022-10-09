import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import PageConfirmEmail from 'pages/PageConfirmEmail/PageConfirmEmail';
import PageLogin from 'pages/PageLogin/PageLogin';
import PageRegister from 'pages/PageRegister/PageRegister';
import PagePasswordReset from 'pages/PagePasswordReset/PagePasswordReset';

import PageApp from './App';

class DateOptionPortal extends Component {
  render() {
    const prefix = '/date_option_portal';
    const loginPath = `${prefix}/login`;
    const registerPath = `${prefix}/register`;
    const resetPath = `${prefix}/reset`;

    return (
      <div>
        <Switch>
          <Route
            exact
            path={loginPath}
            component={() => (
              <PageLogin
                emailPlaceholder="Date Option Email"
                portal={prefix}
                redirectURL={prefix}
                registerPath={registerPath}
                resetPath={resetPath}
                title="Date Option Portal"
              />
            )}
          />
          <Route
            exact
            path={registerPath}
            component={() => (
              <PageRegister
                loginPath={loginPath}
                portal={prefix}
                redirectURL={prefix}
                resetPath={resetPath}
              />
            )}
          />
          <Route
            exact
            path={resetPath}
            component={() => (
              <PagePasswordReset
                appPath={prefix}
                loginPath={loginPath}
                portal={prefix}
                registerPath={registerPath}
                resetPath={resetPath}
              />
            )}
          />
          <Route
            path={prefix}
            component={
              this.props.emailVerified
                ? PageApp
                : () => (
                    <PageConfirmEmail
                      appPath={prefix}
                      loginPath={loginPath}
                      portal={prefix}
                    />
                  )
            }
          />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { emailVerified: state.firebase.auth.emailVerified };
};

export default connect(mapStateToProps)(DateOptionPortal);
