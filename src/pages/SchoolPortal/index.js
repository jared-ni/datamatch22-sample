import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import PageConfirmEmail from 'pages/PageConfirmEmail/PageConfirmEmail';
import PageLogin from 'pages/PageLogin/PageLogin';
import PageRegister from 'pages/PageRegister/PageRegister';
import PagePasswordReset from 'pages/PagePasswordReset/PagePasswordReset';

import PageApp from './App';

class SchoolPortal extends Component {
  render() {
    const prefix = '/school_portal';
    const loginPath = `${prefix}/login`;
    const registerPath = `${prefix}/register`;
    const resetPath = `${prefix}/reset`;

    return (
      <div className="PageSchoolRoot">
        <Switch>
          <Route
            exact
            path={loginPath}
            render={() => (
              <PageLogin
                emailPlaceholder="College Email"
                portal={prefix}
                redirectURL={prefix}
                registerPath={registerPath}
                resetPath={resetPath}
                title="University Portal"
              />
            )}
          />
          <Route
            exact
            path={registerPath}
            render={() => (
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
            render={() => (
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
            render={
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

export default connect(mapStateToProps)(SchoolPortal);
