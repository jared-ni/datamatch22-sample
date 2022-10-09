import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import moment from 'moment';
import Banner from 'react-js-banner';
import Confetti from 'react-confetti';

import launch from 'constants/Launch';
import Loading from 'components/Loading';

import PageApp from './PageApp/PageApp';
import PageAuth from './PageAuth/PageAuth';
import PageGender from './PageGender/PageGender';
import PageLanding from './PageLanding/PageLanding';
import PageMain from './PageMain/PageMain';
import PagePrivacy from './PagePrivacy/PagePrivacy';
import PagePress from './PagePress/PagePress';
import PageTerms from './PageTerms/PageTerms';
import DateOptionPortal from 'pages/DateOptionPortal';
import SchoolPortal from 'pages/SchoolPortal';

class Root extends React.Component {
  state = {
    // prelaunch is defined as any time before launch and on our production site (datamatch.me)
    prelaunch: moment().isBefore(launch) && process.env.REACT_APP_REAL_SITE,
  };

  componentDidMount() {
    if (this.state.prelaunch) {
      // if we are prelaunch, we want to update prelaunch every second
      this.interval = setInterval(() => {
        const prelaunch =
          moment().isBefore(launch) && process.env.REACT_APP_REAL_SITE;
        this.setState({ prelaunch });

        // once we aren't prelaunch, show confetti and stop updating every second
        if (!prelaunch) {
          this.setState({ confetti: true });
          clearInterval(this.interval);
        }
      }, 1000);
    }
  }

  componentWillUnmount() {
    // set interval cleanup
    this.interval && clearInterval(this.interval);
  }

  render() {
    // show the landing page if we are prelaunch
    if (this.state.prelaunch) {
      return (
        <Switch>
          {/* routes for school and date option portals */}
          <Route path="/school_portal" component={SchoolPortal} />
          <Route path="/date_option_portal" component={DateOptionPortal} />

          {/* static routes for privacy/TOS */}
          <Route exact path="/press" component={PagePress} />
          <Route exact path="/privacy" component={PagePrivacy} />
          <Route exact path="/terms" component={PageTerms} />
          <Route exact path="/gender" component={PageGender} />

          {/* catch all route */}
          <Route>
            <PageLanding />
          </Route>
        </Switch>
      );
    }

    const { emailVerified, isLoaded } = this.props;

    // make sure we have loaded authentication + profile
    if (!isLoaded) {
      return (
        <div style={{ margin: '10% auto' }}>
          <Loading color="white" size={200} type="spin" />
        </div>
      );
    }

    const showBanner = false;

    return (
      <div className="Root">
        {/* TODO: pull banner out into its own component */}
        {showBanner && (
          <div style={{ position: 'absolute', width: '100%', zIndex: 202 }}>
            <Banner
              css={{ backgroundColor: '#333333' }}
              showBanner={true}
              title={
                <div style={{ backgroundColor: '#333333', color: 'white' }}>
                  Join us for speed dating with{' '}
                  <a
                    href="https://meet24.xoxo.sh"
                    rel="noopener noreferrer"
                    style={{ color: 'white', textDecoration: 'underline' }}
                    target="_blank"
                  >
                    meet24.xoxo.sh
                  </a>{' '}
                  from 9-10 PM ET on Friday (10/9)!!
                </div>
              }
            />
          </div>
        )}

        {/* show confetti once launch */}
        {this.state.confetti && (
          <Confetti
            numberOfPieces={400}
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
          />
        )}

        <Switch>
          {/* route for main page (after launch) */}
          <Route exact path="/" component={PageMain} />

          {/* routes for the actual app things that require sign-in */}
          <Route path="/app" component={emailVerified ? PageApp : PageAuth} />

          {/* authentication routes */}
          <Route
            exact
            path="/(auth|login|register|reset)/"
            component={PageAuth}
          />

          {/* routes for school and date option portals */}
          <Route path="/school_portal" component={SchoolPortal} />
          <Route path="/date_option_portal" component={DateOptionPortal} />

          {/* static routes for privacy/TOS */}
          <Route exact path="/press" component={PagePress} />
          <Route exact path="/privacy" component={PagePrivacy} />
          <Route exact path="/terms" component={PageTerms} />
          <Route exact path="/gender" component={PageGender} />

          {/* catch all broken routes */}
          <Route component={() => <Redirect to="/" />} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { auth, profile } = state.firebase;

  return {
    emailVerified: auth.emailVerified,
    isLoaded: auth.isLoaded && profile.isLoaded,
  };
};

export default connect(mapStateToProps)(Root);
