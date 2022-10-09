import React, { Component } from 'react';
import { compose } from 'redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import queryString from 'query-string';

import PageConfirmEmail from 'pages/PageConfirmEmail/PageConfirmEmail';
import PageLogin from 'pages/PageLogin/PageLogin';
import PagePasswordReset from 'pages/PagePasswordReset/PagePasswordReset';
import PageRegister from 'pages/PageRegister/PageRegister';

class PageAuth extends Component {
  render() {
    const { mode } = queryString.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });

    return (
      <div className="PageAuth">
        <Switch>
          {/* login/register routes */}
          <Route exact path="/login">
            <PageLogin emailPlaceholder="College Email" title="Log In" />
          </Route>
          <Route exact path="/register" component={PageRegister} />

          {/* more complicated confirm email/password reset routes */}
          {/* this route is if a user is signed-in and hasn't confirmed their email */}
          <Route exact path="/app" component={PageConfirmEmail} />

          {/* if you want to read more on the auth link specifically: https://support.google.com/firebase/answer/7000714?authuser=0 */}
          <Route
            path="/(auth|reset)"
            render={() =>
              mode === 'verifyEmail' ? (
                // this route is if a user clicks on a verify email link
                <Route path="/auth" component={PageConfirmEmail} />
              ) : (
                // this route is the password reset route
                <Route path="/(auth|reset)" component={PagePasswordReset} />
              )
            }
          />

          {/* catch all other routes */}
          <Route component={() => <Redirect to="/" />} />
        </Switch>
      </div>
    );
  }
}

export default compose(withRouter)(PageAuth);
