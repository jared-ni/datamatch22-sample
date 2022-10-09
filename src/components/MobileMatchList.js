/** @jsx jsx */

import { Component } from 'react';
import { jsx, Button } from 'theme-ui';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import ReactVisibilitySensor from 'react-visibility-sensor';

import { Prompts, SchoolPrompts } from 'constants/Prompts';
import { socialMedia as handles } from 'constants/SocialMedia';
import MatchButton from 'components/MatchButton';
import SpotifyDisplay from 'components/SpotifyDisplay';
import ReactTooltip from 'react-tooltip';
import MobileMatchEntry from './MobileMatchEntry';
import settings from 'constants/config.json';

const matchViewSx = {
  fontSize: 2,

  '.outtakes': {
    display: 'flex',
  },

  '.outtakesBox': {
    border: 'solid 1px #D7525B',
    borderRadius: '2px',
    background: '#F5E3E3',
    width: '190px',
    padding: '20px',
    zIndex: '2',
    margin: 'auto',
  },

  '.outtakes-arrow': {
    color: 'primary',
    display: 'inline-block',
    padding: '20px',
    border: 'none',
    background: '#fff',
  },

  '.name': {
    color: 'black',
    fontSize: 3,
    fontWeight: 'bold',
    display: 'inline-block',
    verticalAlign: 'middle',
  },

  '.popup-box': {
    position: 'fixed',
    background: '#00000050',
    width: '100%',
    height: '100vh',
    top: '0',
    left: '0',
  },

  '.expand-entry-buttons': {
    justifyContent: 'center',
    display: 'flex',
    textAlign: 'center',
    margin: '-10px',
  },

  '.individual-button': {
    margin: '15px',
    display: 'inline',
  },

  '.margin-spacing': {
    margin: '0 2px 0 2px',
  },

  '.entry-top': {
    borderBottom: 'solid 2px #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
  },

  '.box': {
    position: 'relative',
    width: '90%',
    margin: '0 auto',

    maxHeight: '70vh',
    marginTop: 'calc(100vh - 85vh - 10px)',
    background: '#fff',
    borderRadius: '5px',
    padding: '25px',
    border: '1px solid #999',
    overflow: 'auto',
    textAlign: 'left',
  },

  '.close-icon': {
    color: 'primary',
    cursor: 'pointer',
    position: 'fixed',
    right: 'calc(6%)',
    top: 'calc(100vh - 84vh - 13px)',
    fontSize: '20px',
    border: 'none',
    background: '#FFF',
  },

  '.mobile-flexContainer': {
    display: 'flex',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: '#e0e0e0',
    alignItems: 'center',
    textAlign: 'left',
    maxHeight: '100px',
    ':hover': {
      backgroundColor: '#fcfcfc',
    },
  },

  '.section-img': {
    display: 'inline-block',
    position: 'static',
    padding: '25px 0 25px 25px',
    fontSize: '2px',
  },

  '.section-img-entry': {
    display: 'inline-block',
    position: 'static',
    padding: '0 0 0 0',
    fontSize: '2px',
  },

  '.section-one': {
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '25px',
    width: '550px',
    position: 'static',
  },

  '.view-arrow': {
    color: 'primary',
    fontSize: '30px',
    display: 'inline-block',
    padding: '20px',
  },

  '.primaryColored': {
    color: 'primary',
    fontWeight: 'bold',
  },

  '.social, .social:hover': {
    textDecoration: 'none',
    color: 'text',
  },

  '.profilePic': {
    width: '250px',
    height: '250px',
    marginBottom: '15px',
  },

  '.view-profilePic': {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    display: 'inline-block',
  },

  '@media (max-width: 700px)': {
    img: {
      maxHeight: '70px',
      maxWidth: '70px',
    },
  },

  '.flexContainer': {
    display: 'flex',
  },

  '.fixed': {
    minWidth: '50%',
    flexBasis: '250px',
  },

  '.flex-item': {
    flexWrap: 'wrap',
  },
};

class MatchView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  render() {
    const {
      hasMatched,
      horizontalLayout,
      initiateMatch,
      match,
      matchRef,
      matchStatus,
      otherUid,
      privateProfile,
      showButton,
      uid,
      user,
      userTimes,
      userTimezone,
      onVisibilityChange,
    } = this.props;

    // if the user doesn't exist (account deleted), we don't show the match
    if (!user) {
      return null;
    }

    // pull the necessary attributes off the other user's profile
    const {
      college,
      description,
      dorm,
      location,
      meet,
      name,
      profile_pic,
      spotifyTopArtists,
      times,
      year,
      prompt,
      verified,
      zoom,
    } = user;

    // pull match attributes necessary
    const { canDate, rating, relationshipType } = match || {};
    const { gender, pronouns } = privateProfile || {};

    const love = relationshipType === 'true love';

    // popup state and function
    const togglePopup = () => {
      this.setState({ isOpen: !this.state.isOpen });
    };

    // filter out handles that aren't present
    const getHandle = social => user[handles[social].field];
    const socialLinks = Object.keys(handles).filter(social =>
      getHandle(social),
    );

    // map each handle to a formatted link
    const socials = socialLinks.map((social, index) => (
      <span key={social}>
        {social}{' '}
        <a
          href={handles[social].url + getHandle(social)}
          rel="noopener noreferrer"
          target="_blank"
          className="social"
        >
          {'@' + getHandle(social)}
        </a>
        {/* insert commas except after the last handle (or if there are only two) */}
        {index < socialLinks.length - 1 && socialLinks.length !== 2
          ? ', '
          : ' '}
        {/* insert an 'or' before the last handle */}
        {index === socialLinks.length - 2 ? 'or ' : ''}
      </span>
    ));

    const promptQuestions = Prompts.slice();
    const schoolPrompt = SchoolPrompts[college];
    if (schoolPrompt && promptQuestions[0].length < 6) {
      promptQuestions[0] = promptQuestions[0].concat(schoolPrompt);
    }

    const outtakes =
      prompt &&
      prompt.map(
        (promptInfo, index) =>
          promptInfo.answer && (
            <div key={index}>
              <div className="primaryColored">
                {promptQuestions[index][promptInfo.id]}
              </div>
              <div>{promptInfo.answer}</div>
              <br />
            </div>
          ),
      );

    const meetPreference = zoom ? (
      meet ? (
        <div>
          Down to meet <b>in person</b> or over <b>Zoom</b>
        </div>
      ) : (
        <div>
          Down to meet over <b>Zoom</b>
        </div>
      )
    ) : meet ? (
      <div>
        Down to meet <b>in person</b>
      </div>
    ) : null;

    const displayFreeDateMsg =
      settings.college_to_dateOption[college] &&
      settings.college_to_dateOption[college].length !== 0;

    return horizontalLayout ? (
      <div sx={matchViewSx}>
        <div className="mobile-flexContainer" onClick={togglePopup}>
          <div className="section-img">
            <img
              alt="profile pic"
              className="view-profilePic"
              src={profile_pic || require('assets/empty.png').default}
              sx={{
                objectFit: 'cover',
                background: `url(${require('assets/loading.svg').default})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            />
          </div>
          <div className="section-one">
            <div className="name">
              {name}
              &nbsp;
              {verified && (
                <span data-tip={'Datamatch Member'}>
                  <img
                    alt="tick"
                    src={require('assets/verified-check.svg').default}
                    width="15"
                    height="15"
                  />
                  <ReactTooltip place="top" multiline={true} />
                </span>
              )}
              <div sx={{ fontSize: 1 }} className="primaryColored">
                {rating
                  ? `${(rating * 100).toFixed(2)}% ${
                      love ? 'LOVE' : 'FRIENDSHIP'
                    }`
                  : 'Search Matched'}

                <br />
                {year && ' ' + year}
              </div>
            </div>
            <br />
          </div>
          <div className="view-arrow">
            <button
              type="input"
              sx={{
                border: 'none',
                backgroundColor: '#F8F8F8',
                color: 'primary',
                display: 'inline-block',
              }}
            >
              <i className="fas fa-chevron-right" />
            </button>
          </div>
        </div>
        {this.state.isOpen && (
          <MobileMatchEntry
            addToReportList={this.props.addToReportList}
            profile_pic={profile_pic}
            rating={rating}
            love={love}
            canDate={canDate}
            showButton={showButton}
            name={name}
            verified={verified}
            hasMatched={hasMatched}
            initiateMatch={initiateMatch}
            match={match}
            matchStatus={matchStatus}
            otherUid={otherUid}
            college={college}
            location={location}
            year={year}
            dorm={dorm}
            pronouns={pronouns}
            gender={gender}
            description={description}
            outtakes={outtakes}
            uid={uid}
            spotifyTopArtists={spotifyTopArtists}
            userTimes={userTimes}
            times={times}
            userTimezone={userTimezone}
            meetPreference={meetPreference}
            socials={socials}
            handleClose={togglePopup}
          />
        )}
      </div>
    ) : (
      <div sx={matchViewSx} ref={matchRef}>
        <img
          alt="profile pic"
          className="profilePic"
          src={profile_pic || require('assets/empty.png').default}
          sx={{
            objectFit: 'cover',
            background: `url(${require('assets/loading.svg').default})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
        <div sx={{ fontSize: 2 }} className="primaryColored">
          {rating
            ? `${(rating * 100).toFixed(2)}% ${love ? 'LOVE' : 'FRIENDSHIP'}`
            : 'Search Matched'}
        </div>
        <div sx={{ fontSize: 1 }} className="primaryColored">
          {canDate &&
            displayFreeDateMsg &&
            'Eligible for a free/discounted date!'}
        </div>

        <div sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* call onVisibilityChange whenever the name of a match enters/exits the screen */}
          <ReactVisibilitySensor onChange={onVisibilityChange}>
            <div
              sx={{
                fontSize: 5,
                fontWeight: 'bold',
                maxWidth: showButton ? 'calc(100% - 120px)' : 'calc(100%)',
              }}
            >
              {name}
              &nbsp;
              {verified && (
                <span data-tip={'Datamatch Member'}>
                  <img
                    alt="tick"
                    src={require('assets/verified-check.svg').default}
                    width="20"
                    height="20"
                  />
                  <ReactTooltip place="top" multiline={true} />
                </span>
              )}
            </div>
          </ReactVisibilitySensor>
          {showButton && (
            <div>
              <MatchButton
                hasMatched={hasMatched}
                initiateMatch={initiateMatch}
                match={match}
                matchStatus={matchStatus}
                otherUid={otherUid}
              />
            </div>
          )}
        </div>

        <div>
          {college}
          {year && ' ' + year}
          {location &&
            ', ' +
              (location.campusLocation === 'on-campus'
                ? (dorm || '') + ', On/Near Campus'
                : location.state || location.country || '')}
          {pronouns && pronouns.map(pronoun => ', ' + pronoun)}
        </div>
        {gender && gender.optional && <div>{gender.optional}</div>}
        <br />
        <div>{description}</div>
        {description && <br />}
        {outtakes}
        {spotifyTopArtists ? (
          <SpotifyDisplay objects={spotifyTopArtists} />
        ) : null}
        {spotifyTopArtists && <br />}
        {(userTimes, times, userTimezone)}
        <div>{meetPreference}</div>
        {socials.length !== 0 && <div>Reach me on {socials}</div>}
        <br />
        {showButton && (
          <Link to={`/app/messages/${otherUid}`} className="messageButton">
            <Button variant="primary">Message {name}</Button>
          </Link>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    userTimes: (state.firebase.data.publicProfile || {}).times,
    userTimezone: (state.firebase.data.publicProfile || {}).timezone,
    privateProfile: (state.firebase.data.privateProfiles || {})[props.otherUid],
  };
};

export default compose(
  firebaseConnect(({ hasMatched, matchStatus, otherUid, user }) => {
    const { privacy } = user;
    const getPronouns =
      privacy === 'public' ||
      (privacy === 'mutual' && hasMatched && matchStatus);
    return getPronouns
      ? [
          {
            path: `/privateProfile/${otherUid}/gender`,
            storeAs: `/privateProfiles/${otherUid}/gender`,
          },
          {
            path: `/privateProfile/${otherUid}/pronouns`,
            storeAs: `/privateProfiles/${otherUid}/pronouns`,
          },
        ]
      : [];
  }),
  connect(mapStateToProps),
)(MatchView);
