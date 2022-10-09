/** @jsx jsx */

import { Component, Fragment } from 'react';
import { jsx } from 'theme-ui';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Chat from 'pages/PageMessages/Chat';
import Link from 'components/Link';
import Loading from 'components/Loading';
import MatchView from 'components/MatchView';
import { allMatchesAndProfilesLoaded, getMatchId } from 'utils/match';
import { Mixpanel } from 'utils/mixpanel';

import NoMatchesImage from 'assets/no-matches.gif';
import NoResultsImage from 'assets/no-results.gif';
import PreResultsImage from 'assets/under-construction.gif';

import { pageMessagesSx } from 'pages/PageMessages/PageMessagesStyles';

class PageMessages extends Component {
  constructor(props) {
    super(props);
    const { catalog, selectedUid } = props;
    const selectedIndex = Object.keys(catalog).indexOf(selectedUid);
    this.state = {
      selected: selectedIndex === -1 ? null : selectedUid,
      selectedIndex,
      showSidebar: true,
      mobile: window.innerWidth <= 770,
      show: false,
    };
  }

  componentDidMount() {
    if (this.state.selected && this.state.mobile) {
      this.setState({ showSidebar: false });
    }

    // Web analytics
    Mixpanel.track('Messages_Page', {});
  }

  // switch to a different chat
  changeSelected = (uid, index) => () => {
    this.setState({ selected: uid, selectedIndex: index });
    if (this.state.mobile) {
      this.toggleSidebar();
    }
  };

  // clear selected if no longer in new catalog
  componentDidUpdate = prevProps => {
    const { catalog, selectedUid } = this.props;
    const oldKeys = Object.keys(prevProps.catalog);
    const newKeys = Object.keys(catalog);
    const same = oldKeys.every(key => newKeys.includes(key));
    if (!(same && oldKeys.length === newKeys.length)) {
      this.setState({ selected: null, selectedIndex: -1 });
    }
    // if the URL selectedUid changes, let's also update the view
    if (selectedUid !== prevProps.selectedUid) {
      const selectedIndex = Object.keys(catalog).indexOf(selectedUid);
      this.setState({
        selected: selectedIndex === -1 ? null : selectedUid,
        selectedIndex,
        showSidebar: this.state.mobile ? false : true,
      });
    }
  };

  // get display uids (filtered out null profiles, sorted by match rating)
  getDisplayUids = () => {
    const { catalog, matches, matchStatuses, profiles } = this.props;

    const sortable = Object.entries(catalog)
      .filter(person => profiles[person[0]] && !catalog[person[0]].reported)
      .map(person => {
        const { rating = 0 } = matches[person[0]] || {};
        // unread is first priority, mutually matched is second, rating is third
        if (person[1].unread && person[1].unread > 0) {
          return [person[0], Number(rating) + 1000];
        } else {
          return [
            person[0],
            matchStatuses[person[0]] && catalog[person[0]].matched
              ? Number(rating) + 500
              : Number(rating),
          ];
        }
      });
    sortable.sort((a, b) => b[1] - a[1]);

    return sortable.map(([otherUid, _rating]) => otherUid);
  };

  // go to the next chat in line
  nextMatch = () => {
    const keys = this.getDisplayUids();
    this.setState(({ selectedIndex }) => ({
      selected: keys[(selectedIndex + 1) % keys.length],
      selectedIndex: (selectedIndex + 1) % keys.length,
    }));
  };

  getMatchDescription = (college, dorm, year) => {
    let description = college;
    if (year) {
      description += ' ' + year;
    }
    if (dorm) {
      description += ', ' + dorm;
    }
    return description;
  };

  getMessagesMatches = () => {
    const { catalog, profiles } = this.props;
    const { selected } = this.state;

    // if no matches, don't display anything
    if (catalog === {}) {
      return null;
    }

    return this.getDisplayUids().map((otherUid, index) => {
      const { college, dorm, name, profile_pic, year } = profiles[otherUid];
      const { unread } = catalog[otherUid];
      return (
        <div
          className={
            'messages-match' + (selected === otherUid ? ' selected' : '')
          }
          key={otherUid}
          onClick={this.changeSelected(otherUid, index)}
        >
          <img
            alt="profile pic"
            className="roundProfilePic"
            src={profile_pic || require('assets/empty.png').default}
          />
          <div
            className={unread && 'unread'}
            style={{ marginLeft: 10, maxWidth: 'calc(100% - 40px)' }}
          >
            <div>{name + (unread ? ` (${String(unread)})` : '')}</div>
            <div style={{ color: '#D7525B', fontSize: 12 }}>
              {this.getMatchDescription(college, dorm, year)}
            </div>
          </div>
        </div>
      );
    });
  };

  noResults = () => {
    return (
      <div className="no-results">
        <h4>Not found :(</h4>
        <img alt="not found" src={NoResultsImage} width="100%" />
      </div>
    );
  };

  noMatches = () => {
    if (this.props.status === 'live-matches') {
      return (
        <div className="no-results">
          <h4>No matches :(</h4>
          <div>
            You likely didn't fill in your profile or the survey completely.
          </div>
          <img alt="not found" src={NoMatchesImage} width="100%" />
        </div>
      );
    } else {
      return (
        <div className="no-results">
          <h4>Sit tight!</h4>
          <div>
            Matches will be released on Valentine’s Day. Meanwhile, make sure
            you have finished filling out your{' '}
            <Link to="/app/profile">profile</Link> and{' '}
            <Link to="/app/survey">survey</Link>!
          </div>
          <img alt="not found" src={PreResultsImage} width="100%" />
        </div>
      );
    }
  };

  renderHeader = (query, searchUids) => {
    if (!searchUids) {
      return (
        <Fragment>
          <div style={{ fontWeight: 700, fontSize: 20 }}>Messages</div>
          <div style={{ fontSize: 12 }}>
            Message your mutual matches to schedule a date or chat about life!
          </div>
        </Fragment>
      );
    }

    // search header
    const params = new URLSearchParams(query);
    const searchName = params.get('name');
    return (
      <Fragment>
        <div style={{ fontWeight: 700, fontSize: 20 }}>Search results</div>
        <div style={{ fontSize: 15 }}>for "{searchName}"</div>
        <div
          className="header-text"
          style={{
            margin: '10px 0',
            zoom: '0.95',
            background: 'rgba(249, 169, 165, 0.5)',
            padding: '10px',
            maxWidth: '600px',
          }}
        >
          If you match someone you searched for, they will <b>not</b> know that
          you matched them unless they also search match you. Go ahead, shoot
          your shot!
        </div>
      </Fragment>
    );
  };

  toggleSidebar = () => {
    this.setState({ showSidebar: !this.state.showSidebar });
    if (!this.state.showSidebar) {
      this.setState({ selected: null });
    }
  };

  render() {
    const {
      catalog,
      college,
      dismissNotifBanner,
      loaded,
      matches,
      matchStatuses,
      profiles,
      query,
      searchUids,
      showNotifBanner,
      uid,
    } = this.props;
    const { selected, selectedIndex } = this.state;

    // show loading screen if all matches or all profiles are not loaded
    if (!loaded) {
      return (
        <div style={{ flex: '0 0 250px', height: 200 }}>
          <Loading color="black" />
        </div>
      );
    }

    const matchId = selected != null && getMatchId(selected, uid);
    // Show "No results" if already loaded and no uids to display
    // Show "No matches" if nothing was searched and no uids to display
    const displayNoResults = this.getDisplayUids().length === 0;

    return (
      <div sx={pageMessagesSx}>
        {this.state.showSidebar && (
          <div
            className={
              this.state.mobile ? 'messages-sidebar-mobile' : 'messages-sidebar'
            }
            style={{ overflowY: 'scroll' }}
          >
            <div className="messages-description">
              {this.renderHeader(query, searchUids)}
              {displayNoResults &&
                (searchUids ? this.noResults() : this.noMatches())}
            </div>
            {this.getMessagesMatches()}
          </div>
        )}
        {selected && (
          /* Need fragment due to flexbox */
          <Fragment>
            <Chat
              college={college}
              dismissNotifBanner={dismissNotifBanner}
              hasMatched={catalog[selected].matched}
              match={matches[selected]}
              matchId={matchId}
              matchStatus={matchStatuses[selected]}
              otherName={(profiles[selected] || {}).name}
              profile_pic={(profiles[selected] || {}).profile_pic}
              otherUid={selected}
              user={uid < selected ? 'user1' : 'user2'}
              unread={catalog[selected].unread}
              showNotifBanner={showNotifBanner}
              toggleSidebar={this.toggleSidebar}
              mobile={this.state.mobile}
            />
            {/* Profile preview of the user you are chatting with */}
            {!this.state.mobile && (
              //<div></div>
              <div className="profile-preview">
                {catalog[selected].reported ? null : (
                  <MatchView
                    addToReportList={this.props.addToReportList}
                    horizontalLayout={false}
                    match={matches[selected]}
                    otherUid={selected}
                    user={profiles[selected]}
                    nextMatch={this.nextMatch}
                  />
                )}

                {/* Don't display next match for last match */}
                {selectedIndex + 1 < this.getDisplayUids().length ? (
                  <div className="next-match" onClick={this.nextMatch}>
                    Next Match →
                  </div>
                ) : null}
              </div>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { catalog } = props;
  const { matches, matchStatuses, profiles } = state.firebase.data;
  return {
    loaded: allMatchesAndProfilesLoaded({ catalog, matches, profiles }),
    matches: matches || {},
    matchStatuses: matchStatuses || {},
    profiles,
  };
};

export default compose(connect(mapStateToProps))(PageMessages);
