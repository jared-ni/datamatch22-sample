/** @jsx jsx */

import React, { Component, Fragment } from 'react';
import { jsx } from 'theme-ui';
import { withRouter } from 'react-router-dom';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { Mixpanel } from 'utils/mixpanel';
import {
  allMatchesAndProfilesLoaded,
  getMatchId,
  makeMatch,
} from 'utils/match';
import { areMatchesLive } from 'utils/status';
import Container from 'components/Container';
import Header from 'components/Header';
import Loading from 'components/Loading';
import MatchView from 'components/MatchView';
import MobileMatchList from 'components/MobileMatchList';
import Sponsors from 'components/Sponsors';
import PageMatchPreferences from 'pages/PageMatchPreferences/PageMatchPreferences';
import PageNoMatches from 'pages/PageNoMatches/PageNoMatches';
import Input from 'components/Input';

import { matchBlurbs } from 'constants/MatchBlurbs';

import { pageResultsSx } from 'pages/PageResults/PageResultsStyles';

class PageResults extends Component {
  state = { visibleIndex: 0 };

  componentDidMount() {
    // Web analytics
    Mixpanel.track('Results_Page', {});

    // update match reveal when page is loaded
    this.updateMatchRevealed();

    // HACK: reset visibleIndex when you go to another page and come back to the matches page
    this.setState({ visibleIndex: 0 });
  }

  renderMatchBlurb = () => {
    const { college } = this.props;
    let matchBlurb = matchBlurbs.filter(mb => mb.colleges.includes(college));
    if (matchBlurb.length < 1) {
      matchBlurb = matchBlurbs.filter(mb => mb.colleges.includes('Other'));
    }
    return matchBlurb[0].blurb.split('\n').map(str => (
      <Fragment>
        {str}
        <br />
      </Fragment>
    ));
  };

  scrollToMatch = ref => {
    ref.current.scrollIntoView({
      behavior: 'smooth',
    });
  };

  // keeps track of which match is visible
  onVisibilityChange = (isVisible, index) => {
    if (isVisible) {
      this.setState({ visibleIndex: index });
    }
  };

  // update matchReveal
  updateMatchRevealed = () => {
    const {
      firebase: { update },
      status,
      uid,
      matchRevealed,
    } = this.props;

    // only updates when the matches are out and haven't been revealed
    if (areMatchesLive(status) && !matchRevealed) {
      update(`/privateProfile/${uid}`, { matchRevealed: true });
    }
  };

  componentDidUpdate(prevProps) {
    // HACK: to make sure visible index starts at 0 when the page loads
    if (this.props.loaded !== prevProps.loaded) {
      this.setState({ visibleIndex: 0 });
    }
  }

  initiateMatch = async (otherUid, hasMatched) => {
    const { firebase, makeMatch, uid } = this.props;
    await makeMatch(otherUid, hasMatched);
    // send notification email, (cloud function will check if it is mutual)
    const matchId = getMatchId(uid, otherUid);
    await firebase.functions().httpsCallable('email-notifyMatched')({
      matchId,
      otherUid,
      uid,
    });
  };

  // used by search input
  searchName = e => {
    if (e.key === 'Enter') {
      const query = e.target.value.replace(' ', '+');
      const redirect = query && `/search?name=${query}`;
      this.props.history.push(`/app/messages${redirect}`);
      this.toggleSearchBar();
    }
  };

  render() {
    const {
      catalog,
      loaded,
      matches,
      matchStatuses,
      profiles,
      status,
      uid,
    } = this.props;

    // if matches have not been released yet, render the no matches page
    if (status === 'live-survey') {
      return <PageMatchPreferences uid={uid} />;
    }

    if (status === 'live-processing') {
      return (
        <Container>
          <Header>Matches</Header>
          <br />
          <PageNoMatches status={status} uid={uid} />
          <br />
        </Container>
      );
    }

    // show loading screen if the matches or profiles are not loaded
    if (!loaded) {
      return (
        <div style={{ height: 200 }}>
          <Loading />
        </div>
      );
    }

    // if the user has no matches, this is most likely because of an incomplete survey
    if (isEmpty(matches)) {
      return (
        <Container>
          <Header>Matches</Header>
          <br />
          <div>
            Survey and matches are officially closed! If you have no matches, it
            looks like you didn't fill out the survey fully :(
          </div>
          <Sponsors college={this.props.college} blurbLocation="results-page" />
        </Container>
      );
    }

    // we need to sort the matches by rating
    const sortable = Object.keys(matches)
      // we make sure the match actually exists
      .filter(
        otherUid =>
          matches[otherUid] &&
          profiles[otherUid] &&
          !catalog[otherUid].reported,
      )
      // then sort by the rating on the match
      .map(otherUid => {
        const { rating = 0 } = matches[otherUid];
        return [otherUid, Number(rating)];
      });
    sortable.sort((a, b) => b[1] - a[1]);

    // grab the match ids to render
    const ids = sortable.map(([otherUid, _rating]) => otherUid);

    // create a ref for each match
    const refs = new Array(Object.keys(matches).length)
      .fill(null)
      .map(React.createRef);

    // create a link that allows scolling to the corresponding match for each match
    const nameLinks = ids.map((otherUid, index) => {
      const love = matches[otherUid].relationshipType === 'true love';
      const icon = love ? 'heart' : 'smile-beam';
      return (
        <div key={otherUid}>
          <span
            onClick={() => this.scrollToMatch(refs[index])}
            style={
              // if this match is visible, make the name link bold
              this.state.visibleIndex === index
                ? { cursor: 'pointer', fontWeight: 'bold' }
                : { cursor: 'pointer' }
            }
          >
            <i className={`far fa-${icon}`}></i> {profiles[otherUid].name}
          </span>
        </div>
      );
    });
    return (
      <div sx={pageResultsSx}>
        <div className="desktop-matches">
          <div className="matchesSidebar">
            <div>{nameLinks}</div>
            <br />
            <div>
              <i className="far fa-heart"></i> Love
              <br />
              <i className="far fa-smile-beam"></i> Friendship
            </div>
          </div>
          <div className="desktop-flexContainer">
            <div className="desktop-fixed">
              <Header>Matches</Header>
            </div>
            <div className="flex-item">
              <p style={{ fontSize: '14px' }}>
                Once both you and the other person click “Match,” you’ll be able
                to chat with them. You can schedule <b>dates</b> with anyone
                marked eligible for a free/discounted date once you've begun a
                chat with them.
              </p>
            </div>
          </div>
          <div className="matchesList">
            <div className="header-text">{this.renderMatchBlurb()}</div>
            <br />
            {ids.map((otherUid, index) => (
              <MatchView
                addToReportList={this.props.addToReportList}
                hasMatched={catalog[otherUid].matched}
                horizontalLayout={false}
                initiateMatch={this.initiateMatch}
                key={otherUid}
                match={matches[otherUid]}
                matchRef={refs[index]}
                matchStatus={(matchStatuses || {})[otherUid]}
                otherUid={otherUid}
                showButton={true}
                uid={uid}
                user={profiles[otherUid]}
                onVisibilityChange={isVisible =>
                  this.onVisibilityChange(isVisible, index)
                }
              />
            ))}
            <Sponsors
              college={this.props.college}
              blurbLocation="results-page"
            />
          </div>
        </div>

        <div className="mobile-matches">
          <div className="mobile-matchesList">
            <div className="mobileHeader">
              <Header>Matches</Header>
            </div>
            <div className="flexContainer">
              <div className="flex-item">
                <p style={{ fontSize: '14px', textAlign: 'left' }}>
                  Once both you and the other person click “Match,” you’ll be
                  able to chat with them. You can schedule <b>dates</b> with
                  anyone marked eligible for a free/discounted date once you've
                  begun a chat with them.
                  <br />
                  <br />
                  <div className="header-text">{this.renderMatchBlurb()}</div>
                  <br />
                  If you're not a fan of your matches,
                </p>
                {areMatchesLive(status) && (
                  <Input
                    className="SearchBar"
                    onKeyPress={this.searchName}
                    placeholder="Search for someone, shoot your shot!"
                  />
                )}
              </div>
            </div>
            <br />
            {ids.map((otherUid, index) => (
              <MobileMatchList
                addToReportList={this.props.addToReportList}
                hasMatched={catalog[otherUid].matched}
                horizontalLayout={true}
                initiateMatch={this.initiateMatch}
                key={otherUid}
                match={matches[otherUid]}
                matchStatus={(matchStatuses || {})[otherUid]}
                otherUid={otherUid}
                showButton={true}
                uid={uid}
                user={profiles[otherUid]}
                onVisibilityChange={isVisible =>
                  this.onVisibilityChange(isVisible, index)
                }
              />
            ))}
            <Sponsors
              college={this.props.college}
              blurbLocation="results-page"
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const {
    catalog,
    firebase: { update },
    uid,
  } = props;
  const { matches, matchStatuses, profiles } = state.firebase.data;
  return {
    loaded: allMatchesAndProfilesLoaded({ catalog, matches, profiles }),
    matches: matches || {},
    matchStatuses: matchStatuses || {},
    profiles,
    uid,
    makeMatch: makeMatch(update, uid, catalog),
  };
};

export default compose(
  withRouter,
  firebaseConnect(({ uid }) => [
    {
      path: `/privateProfile/${uid}/matchRevealed`,
      storeAs: 'matchRevealed',
    },
  ]),
  connect(mapStateToProps),
)(PageResults);
