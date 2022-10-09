import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { Route, Switch, Redirect } from 'react-router-dom';

import Loading from 'components/Loading';
import Navbar from 'components/Navbar';

import Home from './Home';
import PageSurvey from 'pages/PageSurvey/PageSurvey';
import Profile from './Profile';
import SchoolSidebar from './SchoolSidebar';
import Survey from './Survey';
import Team from './Team';
import DateOptions from './DateOptions/DateOptions';
import SchoolSponsors from './SchoolSponsors';

class PageApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      school: props.profile.schoolAdmin,
    };
  }

  async componentDidMount() {
    const { firebase, isLoggedIn, profile } = this.props;
    let school = profile.schoolAdmin;

    // if we aren't 100% sure this person is a schoolAdmin
    if (isLoggedIn && !school) {
      const { data } = await firebase
        .functions()
        .httpsCallable('user-makeSchoolAdmin')();
      school = data;
    }

    this.setState({ loading: false, school });
  }

  render() {
    const { loading, school } = this.state;

    if (loading) {
      return (
        <div style={{ margin: '10% auto' }}>
          <Loading size={200} type="spin" />
        </div>
      );
    }

    const prefix = '/school_portal';

    if (!this.props.isLoggedIn) {
      return <Redirect to={`${prefix}/login`} />;
    }

    if (!school) {
      return <Redirect to="/" />;
    }

    return (
      <div className="PageSchool">
        <Navbar sidebar={SchoolSidebar}>
          <Switch>
            <Route
              exact
              path={prefix}
              render={() => <Home school={school} />}
            />
            <Route
              exact
              path={`${prefix}/preview`}
              render={() => (
                <PageSurvey status="live-survey" surveyKey={school} />
              )}
            />
            <Route
              path={`${prefix}/preview/*`}
              render={props => {
                return (
                  <PageSurvey
                    status="live-survey"
                    surveyKey={props.match.params[0]}
                  />
                );
              }}
            />
            <Route
              exact
              path={`${prefix}/school`}
              render={() => <Profile school={school} />}
            />
            <Route
              exact
              path={`${prefix}/survey`}
              render={() => <Survey school={school} />}
            />
            <Route
              exact
              path={`${prefix}/team`}
              render={() => <Team school={school} />}
            />
            <Route
              exact
              path={`${prefix}/dates`}
              render={() => <DateOptions school={school} />}
            />
            <Route
              exact
              path={`${prefix}/sponsors`}
              render={() => <SchoolSponsors school={school} />}
            />
            <Route component={() => <Redirect to={prefix} />} />
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
