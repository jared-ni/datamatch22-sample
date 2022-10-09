import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { Route, Switch, Redirect } from 'react-router-dom';

import Loading from 'components/Loading';
import Navbar from 'components/Navbar';

import CheckIn from './CheckIn';
import ConfirmationCodes from './ConfirmationCodes';
import Home from './Home';
import DateOptionSidebar from './DateOptionSidebar';

class PageApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dateOptionId: props.profile.dateOptionAdmin,
    };
  }

  async componentDidMount() {
    const { firebase, isLoggedIn, profile } = this.props;
    let dateOptionId = profile.dateOptionAdmin;

    // if we aren't 100% sure this person is a dateOptionAdmin
    if (isLoggedIn && !dateOptionId) {
      const { data } = await firebase
        .functions()
        .httpsCallable('user-makeDateOptionAdmin')();
      dateOptionId = data;
    }

    let dateOptionInformation = null;
    if (dateOptionId) {
      const snapshot = await firebase
        .ref(`/dateOptions/${dateOptionId}`)
        .once('value');
      dateOptionInformation = snapshot.val();
    }

    this.setState({
      loading: false,
      dateOptionId,
      dateOptionInformation: dateOptionInformation || {},
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <div style={{ margin: '10% auto' }}>
          <Loading color="white" size={200} type="spin" />
        </div>
      );
    }

    const { dateOptionId, dateOptionInformation } = this.state;
    const prefix = '/date_option_portal';

    if (!this.props.isLoggedIn) {
      return <Redirect to={`${prefix}/login`} />;
    }

    if (!dateOptionId) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <Navbar sidebar={DateOptionSidebar}>
          <Switch>
            <Route
              exact
              path={prefix}
              render={() => (
                <Home
                  dateOptionInformation={dateOptionInformation}
                  {...this.props}
                />
              )}
            />
            <Route
              exact
              path={`${prefix}/check-in`}
              render={() => (
                <CheckIn dateOptionId={dateOptionId} {...this.props} />
              )}
            />
            <Route
              exact
              path={`${prefix}/confirmation-codes`}
              render={() => (
                <ConfirmationCodes
                  dateOptionId={dateOptionId}
                  {...this.props}
                />
              )}
            />
            <Route
              exact
              path={`${prefix}/all-codes`}
              render={() => (
                <ConfirmationCodes
                  dontFilter={true}
                  dateOptionId={dateOptionId}
                  {...this.props}
                />
              )}
            />
          </Switch>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.firebase.auth.uid,
    profile: state.firebase.profile,
  };
};

export default compose(firebaseConnect(), connect(mapStateToProps))(PageApp);
