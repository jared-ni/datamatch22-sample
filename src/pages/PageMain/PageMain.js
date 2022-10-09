/** @jsx jsx */

import { Component } from 'react';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { jsx, Button } from 'theme-ui';

import Loading from 'components/Loading';
import PageFAQ from 'pages/PageFAQ/PageFAQ';
import LiveLanding from 'pages/PageMain/LiveLanding';
import AllSchoolsMap from 'assets/AllSchoolsMap.png';

import { pageMainSx, MoveUpDown } from 'pages/PageMain/PageMainStyles';

class PageMain extends Component {
  handleClick = page => () => {
    this.props.history.push('/' + page);
  };

  render() {
    // make sure total number of users is loaded
    if (!isLoaded(this.props.totalUsers)) {
      return (
        <div style={{ margin: '10% auto' }}>
          <Loading color="white" size={200} type="spin" />
        </div>
      );
    }

    const totalUsers = this.props.totalUsers || 0;

    const { status } = this.props;

    const mobile = window.innerWidth < 1000;

    return (
      <div className="page-landing" sx={pageMainSx}>
        <div>
          <LiveLanding totalUsers={totalUsers} status={status} />

          {!mobile && (
            <div style={{ position: 'absolute', bottom: 80, marginLeft: 50 }}>
              <i
                className="fas fa-chevron-down"
                style={{ fontSize: 30, position: 'absolute', bottom: 0 }}
                sx={{ animation: `${MoveUpDown} 2s ease-in-out infinite` }}
              ></i>
            </div>
          )}
        </div>
        {this.props.isLoggedIn ? (
          <div className="links">
            <Button
              className="button"
              onClick={this.handleClick('app')}
              variant="primary"
            >
              💖 Enter 💖
            </Button>
          </div>
        ) : (
          <div className="links">
            <Button
              className="button"
              onClick={this.handleClick('register')}
              variant="primary"
            >
              Register
            </Button>
            <Button
              className="button"
              onClick={this.handleClick('login')}
              variant="primary"
            >
              Log In
            </Button>
          </div>
        )}
        <div className="screen -map">
          <div className="mapContainer">
            <img
              src={AllSchoolsMap}
              alt="all schools map"
              className="all-schools-map"
            />
          </div>
        </div>
        <div className="screen -faq">
          <div className="faq">
            <PageFAQ landing={true} />
          </div>
        </div>
        {/* <div className="screen -team">
          <img alt="team" src={require('assets/team.jpg').default} />
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    auth: { email, uid },
    data: { status, totalUsers },
    profile: { college, onboarded },
  } = state.firebase;

  return {
    email,
    isLoggedIn: !!uid,
    onboarded,
    school: college,
    status,
    totalUsers,
    uid,
  };
};

export default compose(
  withRouter,
  firebaseConnect([{ path: '/stats/totals/users', storeAs: 'totalUsers' }]),
  connect(mapStateToProps),
)(PageMain);
