/** @jsx jsx */

import { Component } from 'react';
import { jsx } from 'theme-ui';
import { isEmpty, isLoaded } from 'react-redux-firebase';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Confetti from 'react-confetti';

import { Mixpanel } from 'utils/mixpanel';
import { allMatchesAndProfilesLoaded } from 'utils/match';
import Header from 'components/Header';
import MatchRevealView from 'pages/PagePreMatch/MatchRevealView';
import Loading from 'components/Loading';
import { headerHeight, mobileMaxWidth, sidebarWidth } from 'constants/Navbar';

import { pagePreMatchSx } from './PagePreMatchStyles';

class PagePreMatch extends Component {
  componentDidMount() {
    Mixpanel.track('Results_Page', {});
  }

  render() {
    const { matches, profiles } = this.props;

    // show loading screen if the matches or profiles are not loaded
    if (!isLoaded(profiles) || !isLoaded(matches)) {
      return (
        <div style={{ height: 200 }}>
          <Loading />
        </div>
      );
    }

    // if the user has no matches, this is most likely because of an incomplete survey
    if (isEmpty(matches)) {
      return (
        <div className="PagePreMatch" sx={pagePreMatchSx}>
          <Header>Matches</Header>
          <br />
          <div>
            Survey and matches are officially closed! If you have no matches, it
            looks like you didn't fill out the survey fully :(
          </div>
          <br />
        </div>
      );
    }

    // sort the matches by rating
    let sortable = Object.keys(matches)
      // make sure the match actually exists
      .filter(otherUid => matches[otherUid] && profiles[otherUid])
      // sort by the rating on the match
      .map(otherUid => {
        const { rating = 0 } = matches[otherUid];
        return [otherUid, Number(rating)];
      });
    sortable.sort((a, b) => b[1] - a[1]);
    sortable = [sortable[1], sortable[0], sortable[2]];

    // grab the match ids to render
    const matchIds = sortable.map(([otherUid, _rating]) => otherUid);

    // Limit to maximum 3 matches
    const ids = matchIds.length > 3 ? matchIds.slice(0, 3) : matchIds;

    // getting the window height and width for the confetti
    const height = window.innerHeight - headerHeight;
    const width =
      window.innerWidth > mobileMaxWidth
        ? window.innerWidth - sidebarWidth
        : window.innerWidth;

    return (
      <div className="PagePreMatch" sx={pagePreMatchSx}>
        {/* In the current state the confetti feels like rose petals 
        falling which i think goes well with our theme :)) */}
        <Confetti
          width={width}
          height={height}
          recycle={false}
          colors={['pink']}
        />

        <div className="center-content">
          <h2 style={{ textAlign: 'center' }}>The Algorithm has spoken!</h2>
          <div style={{ textAlign: 'center' }}>Here's a quick preview 😉</div>
          <br />
          <br />
          <div className="matches-container">
            {/* <button className='arrows'>&lt;</button> */}
            {/* As we go from 'sm', 'md' to 'lg', the pictures will stack 
            vertically earlier as the screen is made smaller and smaller */}
            {ids.map((otherUid, index) => (
              <div className="col-lg-4 match" key={index}>
                <MatchRevealView
                  match={matches[otherUid]}
                  user={profiles[otherUid]}
                />
              </div>
            ))}
            {/* <button className='arrows'>&gt;</button> */}
          </div>
          <br />
          <button
            className="pinkButton"
            onClick={() => this.props.history.push('/app/results')}
          >
            View all matches
          </button>
          <br />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { catalog } = props;
  const { matches, profiles } = state.firebase.data;
  return {
    loaded: allMatchesAndProfilesLoaded({ catalog, matches, profiles }),
    matches: matches || {},
    profiles,
  };
};

export default compose(withRouter, connect(mapStateToProps))(PagePreMatch);
