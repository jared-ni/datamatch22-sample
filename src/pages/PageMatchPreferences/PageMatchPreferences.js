/** @jsx jsx */

import { Component } from 'react';
import { jsx } from 'theme-ui';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';

import Container from 'components/Container';
import Header from 'components/Header';
import Loading from 'components/Loading';
import Schedule from 'components/Schedule';
import { CategoryLabels } from 'constants/CategoryLabels';
import MatchPrefs from 'stats/MatchPrefs';
import { updateProfiles } from 'utils/updateProfiles';

import {
  pageResultsSx,
  preferencesSx,
} from 'pages/PageMatchPreferences/PageMatchPreferencesStyles';

class PageMatchPreferences extends Component {
  componentDidUpdate(prevProps) {
    if (
      !prevProps.publicProfile ||
      !this.props.publicProfile ||
      !prevProps.privateProfile ||
      !this.props.privateProfile
    ) {
      return;
    }

    const { meet, times, zoom } = this.props.publicProfile;
    const { similar } = this.props.privateProfile;
    const prevPublicProfile = prevProps.publicProfile;
    const prevPrivateProfile = prevProps.privateProfile;
    const noTimes = '0'.repeat(35);

    const haveNotifs =
      (!prevPublicProfile.meet &&
        !prevPublicProfile.zoom &&
        !prevPrivateProfile.similar) ||
      !prevPublicProfile.times ||
      prevPublicProfile.times === noTimes;
    const shouldHaveNotifs =
      (!meet && !zoom && !similar) || !times || times === noTimes;

    if (haveNotifs !== shouldHaveNotifs) {
      this.props.updateNotifications(shouldHaveNotifs ? null : true);
    }
  }

  // handles changes to match category
  handleCategoryChange = category => {
    this.props.updateAllProfiles({ matchCategory: category });
  };

  // handles changes to clicking meet/zoom buttons
  handleClick = event => {
    const { name } = event.target;
    this.props.updateAllProfiles({ [name]: !this.props.publicProfile[name] });
  };

  // handles changes to clicking "my type is..."" button
  handleTypeClick = event => {
    const { name } = event.target;
    if (
      (name === 'similar' && this.props.privateProfile.similar === true) ||
      (name === 'different' && this.props.privateProfile.similar === false)
    ) {
      this.props.updateAllProfiles({ similar: null });
    } else if (name === 'similar') {
      this.props.updateAllProfiles({ similar: true });
    } else if (name === 'different') {
      this.props.updateAllProfiles({ similar: false });
    }
  };

  renderCategory = category => CategoryLabels[category];

  preferencesDisplay = () => {
    const { meet, zoom } = this.props.publicProfile;
    const { similar } = this.props.privateProfile;

    return (
      <div className="Preferences" sx={preferencesSx}>
        <div className="preferences-container">
          <div className="header">My type is...</div>
          <div>
            <span className="regular-text">someone</span>
            <div className="button-container">
              <button
                className={
                  'button ' +
                  (similar === true ? 'button-clicked' : 'button-unclicked')
                }
                name="similar"
                onClick={this.handleTypeClick}
                style={{ position: 'relative' }}
              >
                similar
              </button>
              <button
                className={
                  'button ' +
                  (similar === false ? 'button-clicked' : 'button-unclicked')
                }
                name="different"
                onClick={this.handleTypeClick}
                style={{ position: 'relative' }}
              >
                different
              </button>
            </div>
            <span className="regular-text">who's down to</span>
            <div className="button-container">
              <button
                className={
                  'button ' + (meet ? 'button-clicked' : 'button-unclicked')
                }
                name="meet"
                onClick={this.handleClick}
                style={{ position: 'relative' }}
              >
                meet up
              </button>
              <button
                className={
                  'button ' + (zoom ? 'button-clicked' : 'button-unclicked')
                }
                name="zoom"
                onClick={this.handleClick}
                style={{ position: 'relative' }}
              >
                Zoom
              </button>
              {!(meet || zoom) || similar === undefined ? (
                <span className="small-text">
                  <i className="far fa-square"></i>
                  <span className="icon-space">Who's your type?</span>
                </span>
              ) : (
                <span className="small-text">
                  <i className="far fa-check-square"></i>
                  <span className="icon-space">Saved!</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { matchCategory, publicProfile, privateProfile } = this.props;

    if (!isLoaded(matchCategory, publicProfile, privateProfile)) {
      return (
        <div style={{ height: 200 }}>
          <Loading />
        </div>
      );
    }

    return (
      <Container>
        <div sx={pageResultsSx}>
          <Header>Match preferences</Header>
          <div className="components-container">
            {/* <Grid columns={[1, 2]} className='matchPreferencesGrid'> */}
            <div className="grid-container">
              <div className="top-container">
                <div className="header-text">
                  All I want for Valentine's Day is...
                </div>
                <div className="body-text">
                  {this.renderCategory(matchCategory)}
                </div>
                <MatchPrefs
                  updateCategory={this.handleCategoryChange}
                  currentCategory={matchCategory}
                />
              </div>
              <div className="preferences">
                <this.preferencesDisplay />
              </div>
            </div>
            {/* </Grid> */}
            <div className="schedule">
              <Schedule />
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { email, uid } = state.firebase.auth;
  return {
    matchCategory: state.firebase.data.matchCategory,
    publicProfile: state.firebase.data.publicProfile,
    privateProfile: state.firebase.data.privateProfile,
    updateAllProfiles: updateProfiles(props.firebase.update, uid, email),
    updateNotifications: prefsExist => {
      props.firebase.update(`/notifs/${uid}/pre/`, {
        matchPrefs: prefsExist,
      });
    },
  };
};

export default compose(
  firebaseConnect(props => [
    {
      path: '/privateProfile/' + props.uid + '/matchCategory/',
      storeAs: 'matchCategory',
    },
    {
      path: '/privateProfile/' + props.uid,
      storeAs: 'privateProfile',
    },
  ]),
  connect(mapStateToProps),
)(PageMatchPreferences);
