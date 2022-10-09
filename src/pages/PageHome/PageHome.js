/** @jsx jsx */

import React, { Component } from 'react';
import { Button, jsx } from 'theme-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  firebaseConnect,
  firestoreConnect,
  isLoaded,
} from 'react-redux-firebase';
import { withRouter } from 'react-router-dom';

import Header from 'components/Header';
import Loading from 'components/Loading';
import Sponsors from 'components/Sponsors';
import StorySubmission from 'pages/PageHome/StorySubmission';

import { Mixpanel } from 'utils/mixpanel';
import PagePreMatch from 'pages/PagePreMatch/PagePreMatch';
import { areMatchesLive } from 'utils/status';

import { pageHomeSx } from 'pages/PageHome/PageHomeStyles';

import { Container, Row, Col } from 'react-bootstrap';
import { ReactComponent as ArrowHeart } from './img/arrow-heart.svg';
import SchoolsSignups from 'stats/SchoolsSignups';

class PageHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storyIndex: 0,
      loading: true,
      modalOpen: false,
      paid: false,
    };

    this.scrollRef = React.createRef();
  }

  async componentDidMount() {
    // Web analytics
    Mixpanel.track('Home_Page', {});
    // grab stats from Firestore
    const snapshot = await this.props.firestore
      .collection('stats')
      .doc('totals')
      .get();

    const collegeData = snapshot.data();

    /* then set state correspondingly */
    this.setState({ collegeData, loading: false });
  }

  handleButtonClick = page => () => {
    this.props.history.push('/app/' + page);
  };

  toggleModal = () => {
    if (!this.state.modalOpen) {
      this.scrollRef.current.scrollIntoView();
    }
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  renderMessage = () => {
    const { college, signupNum, totalUsers } = this.props;
    const { paid } = this.state;
    const { survey, profile } = this.props;

    return (
      <>
        <Header>Home</Header>
        <div className="headline">{`You're #${signupNum.toLocaleString()} out of ${totalUsers.toLocaleString()} sign-ups!`}</div>
        <br></br>
        <br></br>
        <div className="caption">
          <p>
            {' '}
            Take the survey, complete your profile, and let The Algorithm&trade;
            do the rest. We’ll reveal your matches on Valentine’s Day.
          </p>
        </div>
        <br></br>
        <br></br>
        <br></br>

        {/* <h1>
            {signupNum && totalUsers
              ? `Live Signups: You're #${signupNum} out of ${totalUsers.toLocaleString()}!`
              : 'Live Signups!'}
          </h1> */}

        {/* <div className="stats-container">
              <SchoolsSignups college={college} data={collegeData} />
              <div className="centered-link">
                <Link to="/app/stats" className="link">
                  view more stats
                </Link>
              </div>
            </div>
            <br /> */}

        <Row>
          <Col md={12} lg={6}>
            {college === 'OSU' ? (
              <div
                className="osu-fundraiser"
                style={
                  this.state.paid
                    ? { backgroundColor: '#F4F2F2' }
                    : { backgroundColor: '#F8D6D6' }
                }
              >
                <h4
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  Fundraising
                  <div
                    className="checkbox"
                    onClick={() => this.setState({ paid: !paid })}
                    style={{ cursor: 'pointer' }}
                  >
                    <div
                      style={
                        this.state.paid
                          ? { display: 'block' }
                          : { display: 'none' }
                      }
                    >
                      <ArrowHeart className="arrow-heart" />
                    </div>
                  </div>
                </h4>
                <p>
                  Hi OSU! Datamatch is being run in collaboration with ChiO as a
                  fundraiser! To get your matches on February 14th, venmo
                  @arielmv $5 by February 12, 11:59 PM and make sure to put your
                  Datamatch account's email in the description so we can verify
                  it! Make sure to set the payment to "private" so your school
                  email isn't publicized.
                </p>
                <br></br>
                <p>
                  When you're all done, check off this task to unlock the rest
                  of the Datamatch experience! Thank you for supporting!
                </p>
                <br></br>
                <a
                  href="https://venmo.com/u/arielmv"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="page-home-section-btn" variant="primary">
                    Venmo
                  </Button>
                </a>
              </div>
            ) : (
              <span></span>
            )}
            <div className="page-home-left page-home-signups-graph">
              <SchoolsSignups
                college={this.props.college}
                data={this.state.collegeData}
              />
            </div>
            Sponsored by
            <Sponsors college={this.props.college} blurbLocation="home-page" />
            <br />
            <br />
          </Col>
          <Col md={12} lg={5}>
            <div
              className="page-home-survey page-home-section mb-5"
              style={
                survey
                  ? { backgroundColor: '#F4F2F2' }
                  : { backgroundColor: '#FFFFF' }
              }
            >
              <h4
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                The Survey
                <div className="checkbox">
                  <div
                    style={survey ? { display: 'block' } : { display: 'none' }}
                  >
                    <ArrowHeart className="arrow-heart" />
                  </div>
                </div>
              </h4>
              <p>Fill out questions. Get your matches.</p>
              <br></br>
              <Button
                className="page-home-section-btn"
                variant="primary"
                onClick={() => this.props.history.push('/app/survey')}
              >
                Take the survey!
              </Button>
            </div>

            <div
              className="page-home-aboutyou page-home-section mb-5"
              style={
                profile
                  ? { backgroundColor: '#F4F2F2' }
                  : { backgroundColor: '#FFFFF' }
              }
            >
              <h4
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                All About You
                <div className="checkbox">
                  <div
                    style={profile ? { display: 'block' } : { display: 'none' }}
                  >
                    <ArrowHeart className="arrow-heart" />
                  </div>
                </div>
              </h4>
              <p>
                Don't be a stranger! In order to receive matches, you must fill
                out the rest of your profile.
              </p>
              <br></br>
              <Button
                className="page-home-section-btn"
                variant="primary"
                onClick={() => this.props.history.push('/app/profile')}
              >
                Go to my profile
              </Button>
            </div>

            <div className="page-home-preferences page-home-section mb-5">
              <h4
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                Your Preferences
              </h4>
              <p>
                Tell us what kinds of people you want to be matched with or make
                matches of your own. May The Algorithm&trade; ever be in your
                favor!
              </p>
              <br></br>
              <Button
                className="page-home-section-btn mr-3"
                variant="primary"
                onClick={() => this.props.history.push('/app/results')}
              >
                Preferences
              </Button>
              <Button
                className="page-home-section-btn mr-3"
                variant="primary"
                onClick={() => this.props.history.push('/app/roulette')}
              >
                Play cupid
              </Button>
              <Button
                className="page-home-section-btn"
                variant="primary"
                onClick={() => this.props.history.push('/app/settings')}
              >
                Blocklist
              </Button>
            </div>
          </Col>
        </Row>
      </>
    );
  };

  render() {
    const { matchCatalog, matchRevealed, status, uid } = this.props;

    // wait for match revealed to be loaded, otherwise we see a flash of match reveal screen every load
    if (!isLoaded(matchRevealed)) {
      return <Loading color="black" />;
    }

    // rendered when the matches are out but 'Matches' page hasn't been visited
    if (
      areMatchesLive(status) &&
      !matchRevealed &&
      Object.keys(matchCatalog).length
    ) {
      return <PagePreMatch catalog={matchCatalog} status={status} uid={uid} />;
    }

    // if stats data is still loading, show loading
    if (this.state.loading) {
      return <Loading color="black" />;
    }

    return (
      <div
        ref={this.scrollRef}
        sx={pageHomeSx}
        className={this.state.modalOpen && 'modal-open'}
      >
        {this.state.modalOpen && (
          <StorySubmission toggleModal={this.toggleModal} />
        )}
        <div
          className="overlay"
          onClick={this.toggleModal}
          style={{
            opacity: this.state.modalOpen ? 0.6 : 0,
            display: !this.state.modalOpen && 'none',
          }}
        ></div>

        <Container id="PageHome" className="p-5">
          {this.renderMessage()}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { uid } = state.firebase.auth;
  const {
    matchRevealed,
    signupNum,
    totalUsers,
    survey,
    profile,
  } = state.firebase.data;

  return { matchRevealed, signupNum, totalUsers, uid, survey, profile };
};

export default compose(
  withRouter,
  firestoreConnect(),
  firebaseConnect(props => [
    {
      path: `/privateProfile/${props.uid}/signupNum`,
      storeAs: 'signupNum',
      type: 'once',
    },
    {
      path: `/privateProfile/${props.uid}/matchRevealed`,
      storeAs: 'matchRevealed',
    },
    {
      path: `/notifs/${props.uid}/pre/survey`,
      storeAs: 'survey',
    },
    {
      path: `/notifs/${props.uid}/pre/profile`,
      storeAs: 'profile',
    },
    {
      path: '/stats/totals/users',
      storeAs: 'totalUsers',
      type: 'once',
    },
  ]),
  connect(mapStateToProps),
)(PageHome);
