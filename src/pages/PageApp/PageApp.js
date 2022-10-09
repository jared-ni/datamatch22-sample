/** @jsx jsx */

import { Component } from 'react';
import { jsx } from 'theme-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter, Redirect, Route, Switch } from 'react-router-dom';
import { firebaseConnect } from 'react-redux-firebase';
import { isLoaded } from 'react-redux-firebase';

// we pull settings directly from our local config file, if we need to update run the update_local_config script
import settings from 'constants/config.json';
import Navbar from 'components/Navbar';
import Loading from 'components/Loading';
import { Mixpanel } from 'utils/mixpanel.js';

import AppSidebar from 'pages/AppSidebar';
import GetSearchResultsContainer from 'pages/GetSearchResultsContainer';
import PageFAQ from 'pages/PageFAQ/PageFAQ';
import PageFeedback from 'pages/PageFeedback/PageFeedback';
import PageGender from 'pages/PageGender/PageGender';
import PageHome from 'pages/PageHome/PageHome';
import PageMessages from 'pages/PageMessages/PageMessages';
import PageOnboard from 'pages/PageOnboard/PageOnboard';
import PagePress from 'pages/PagePress/PagePress';
import PagePrivacy from 'pages/PagePrivacy/PagePrivacy';
import PageProfile from 'pages/PageProfile/PageProfile';
import PageResults from 'pages/PageResults/PageResults';
import PageRoulette from 'pages/PageRoulette/PageRoulette';
import PageSchoolNotFound from 'pages/PageSchoolNotFound/PageSchoolNotFound';
import PageStats from 'pages/PageStats/PageStats';
import PageSettings from 'pages/PageSettings/PageSettings';
import PageSponsors from 'pages/PageSponsors/PageSponsors';
import PageSurvey from 'pages/PageSurvey/PageSurvey';
import PageTeam from 'pages/PageTeam/PageTeam';
import PageTerms from 'pages/PageTerms/PageTerms';

import { fetchMatchObjects } from 'utils/match';
import { areMatchesLive } from 'utils/status';

import { pageContentSx } from 'pages/PageApp/PageAppStyles';

class PageApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNotifBanner: false,
    };
  }

  dismissNotifBanner = () => {
    this.setState({ showNotifBanner: false });
  };

  addToReportList = async (
    reporteeUid,
    reporterUid,
    reportMessage,
    nextMatch = null,
  ) => {
    nextMatch && nextMatch();
    const {
      firebase: { update, push },
    } = this.props;

    if (!reportMessage.trim()) {
      alert('Reason cannot be empty');
      return;
    }

    push('/reportList/', {
      reporter: reporterUid,
      reportee: reporteeUid,
      reason: reportMessage,
      timestamp: new Date().toString(),
    });

    update(`/matchCatalog/${reporterUid}/${reporteeUid}`, { reported: true });
    // this.setState({ show: false, saved: true });
  };

  toggleSearchBar = () => {
    this.setState({ searchOpen: !this.state.searchOpen });
  };

  componentDidMount() {
    const { email, firebase, school, uid } = this.props;
    // Web analytics
    Mixpanel.identify(uid);
    Mixpanel.people.set({
      $email: email,
      School: school,
      'Sign up date': new Date(),
    });

    // Check if current client supports Firebase Cloud Messaging Notifications
    // TODO should we consider cases where users may log in under multiple devices? Do we send to all devices or just one?
    if (firebase.messaging.isSupported()) {
      // Get client registration token. Initially this makes a network call, once retrieved
      // subsequent calls to getToken will return from cache.
      // Will prompt user to allow notifications if they have not allowed or blocked notifs previously.
      const messaging = firebase.messaging();

      messaging
        .getToken({
          vapidKey: process.env.REACT_APP_FCM_VAPID_KEY,
        })
        .then(currentToken => {
          if (currentToken) {
            console.log(currentToken);
            // Store user token under notifs in database to send notifs in future
            firebase.update(`/notifs/${uid}`, { token: currentToken });
          } else {
            // Doesn't ever seem to enter in here...
            console.log(
              'No registration token available. Request permission to generate one.',
            );
          }
        })
        .catch(err => {
          // If user blocks notifications, error thrown and will go here
          console.log('An error occurred while retrieving token. ', err);

          // Show informational pop up for users who disallowed notifs
          if (err.code === 'messaging/permission-blocked') {
            this.setState({ showNotifBanner: true });
          }
        });

      // Handle in-app notifications in foreground
      messaging.onMessage(payload => {
        console.log('Message received. ', payload);
        // display some modal or other dialog with notification info
        // ...
      });
    }
  }

  renderLoading = () => {
    return (
      <div style={{ margin: '10% auto' }}>
        <Loading color="white" size={200} type="spin" />
      </div>
    );
  };

  render() {
    const { email, onboarded, school, status, uid } = this.props;

    // if the status hasn't been loaded, show loading
    if (!isLoaded(status)) {
      return this.renderLoading();
    }

    // if matches are out and matchCatalog hasn't been loaded, show loading
    if (areMatchesLive(status) && !isLoaded(this.props.matchCatalog)) {
      return this.renderLoading();
    }

    // all rendered children will have a fully loaded matchCatalog
    // default matchCatalog to {} if null
    const matchCatalog = this.props.matchCatalog || {};

    // If any matches are unread, set favicon to badge favicon
    if (
      Object.values(matchCatalog).some(
        match => !match.reported && match.unread > 0,
      )
    ) {
      document.getElementById('favicon').href = '/badgefavicon.ico';
    } else {
      // All matches read, reset favicon to default
      document.getElementById('favicon').href = '/favicon.ico';
    }

    // grab the email suffix of the user to compute the college/dorms available
    const suffix = email.split('@')[1];
    const college_to_email = settings.college_to_email;

    // sometimes we hardcode someone's school into the database, so that can be passed in as a prop
    const college =
      school ||
      Object.keys(college_to_email).find(school =>
        college_to_email[school].includes(suffix),
      );
    const dorms = settings.college_to_dorm[college] || [];

    // if the college doesn't exist for Datamatch, show school not found page
    if (!college) {
      return <PageSchoolNotFound email={email} />;
    }

    // if they haven't been onboarded, onboard them
    if (!onboarded) {
      return <PageOnboard college={college} dorms={dorms} />;
    }

    return (
      <div className="PageApp">
        <Navbar sidebar={AppSidebar}>
          <div className="PageContent" sx={pageContentSx}>
            <Switch>
              {/* just a redirect to a subpage, since we don't have a app home dashboard */}
              <Route exact path="/app">
                <Redirect to="/app/home" />
              </Route>

              {/* survey routes */}
              <Route exact path="/app/survey">
                <PageSurvey status={status} surveyKey={college} uid={uid} />
              </Route>
              {/* special backdoor survey route that allows you to look at another school's survey */}
              <Route
                path="/app/survey/*"
                render={props => {
                  return (
                    <PageSurvey
                      status={status}
                      surveyKey={props.match.params[0]}
                    />
                  );
                }}
              />

              {/* profile route */}
              <Route
                path="/app/profile"
                render={() => (
                  <PageProfile
                    college={college}
                    dorms={dorms}
                    status={status}
                    uid={uid}
                  />
                )}
              />

              {/* home route */}
              <Route
                path="/app/home"
                render={() => (
                  <PageHome
                    college={college}
                    matchCatalog={matchCatalog}
                    status={status}
                    uid={uid}
                  />
                )}
              />

              {/* settings route */}
              <Route
                path="/app/settings"
                render={() => <PageSettings status={status} uid={uid} />}
              />

              {/* stats page route */}
              <Route
                path="/app/stats"
                render={() => <PageStats college={college} />}
              />

              {/* crush roulette page route */}
              <Route
                path="/app/roulette"
                render={() => (
                  <PageRoulette email={email} status={status} uid={uid} />
                )}
              />

              {/* messages page route */}
              <Route exact path="/app/results">
                <PageResults
                  addToReportList={this.addToReportList}
                  catalog={matchCatalog}
                  college={college}
                  status={status}
                  uid={uid}
                />
              </Route>

              {/* messages page route */}
              <Route exact path="/app/messages">
                <PageMessages
                  addToReportList={this.addToReportList}
                  catalog={matchCatalog}
                  college={college}
                  dismissNotifBanner={this.dismissNotifBanner}
                  status={status}
                  uid={uid}
                  showNotifBanner={this.state.showNotifBanner}
                />
              </Route>

              {/* search messages page route */}
              <Route
                path="/app/messages/search"
                render={props => (
                  <GetSearchResultsContainer
                    query={props.location.search}
                    matchCatalog={matchCatalog}
                    status={status}
                    uid={uid}
                  />
                )}
              />
              {/* messages with selected match */}
              <Route
                path="/app/messages/*"
                render={props => (
                  <PageMessages
                    college={college}
                    catalog={matchCatalog}
                    dismissNotifBanner={this.dismissNotifBanner}
                    selectedUid={props.match.params[0]}
                    status={status}
                    showNotifBanner={this.state.showNotifBanner}
                    uid={uid}
                  />
                )}
              />

              {/* sponsors route */}
              <Route
                path="/app/sponsors"
                render={() => <PageSponsors college={college} />}
              />

              {/* faq page */}
              <Route
                path="/app/faq"
                render={() => <PageFAQ college={college} />}
              />

              {/* simple static pages */}
              <Route path="/app/feedback" component={PageFeedback} />
              <Route path="/app/gender" component={PageGender} />
              <Route path="/app/press" component={PagePress} />
              <Route path="/app/privacy" component={PagePrivacy} />
              <Route path="/app/team" component={PageTeam} />
              <Route path="/app/terms" component={PageTerms} />
            </Switch>
          </div>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    auth: { email, uid },
    data: { matchCatalog, status },
    profile: { college, onboarded },
  } = state.firebase;

  return {
    email,
    matchCatalog,
    onboarded,
    school: college,
    status,
    uid,
  };
};

export default compose(
  // mapStateToProps is "wrapped around" firebaseConnect because firebaseConnect depends on props
  // status and uid, which are instatiated in mapStateToProps
  connect(mapStateToProps),
  // get status (what event is happening, survey live, matches processing, etc.) from database
  firebaseConnect(({ uid }) => [
    { path: '/status' },
    { path: `/publicProfile/${uid}`, storeAs: 'publicProfile' },
  ]),
  // depending on status, get matchCatalog
  firebaseConnect(({ status, uid }) =>
    areMatchesLive(status)
      ? [{ path: `/matchCatalog/${uid}`, storeAs: 'matchCatalog' }]
      : [],
  ),
  // in the background, let's also just pull the profiles/matches of the people in our matchCatalog
  firebaseConnect(({ matchCatalog, status, uid }) =>
    areMatchesLive(status) ? fetchMatchObjects(matchCatalog, uid) : [],
  ),
  withRouter,
)(PageApp);
