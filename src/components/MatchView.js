/** @jsx jsx **/

import { Component } from 'react';
import { jsx, Button } from 'theme-ui';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import ReactVisibilitySensor from 'react-visibility-sensor';
import Modal from 'react-bootstrap/Modal';
import ReactTooltip from 'react-tooltip';

import Input from 'components/Input';
import { Prompts, SchoolPrompts } from 'constants/Prompts';
import { socialMedia as handles } from 'constants/SocialMedia';
import MatchButton from 'components/MatchButton';
import SpotifyDisplay from 'components/SpotifyDisplay';
import { getAvailableTime } from 'utils/schedule';
import { updateProfiles } from 'utils/updateProfiles';
import settings from 'constants/config.json';

const matchViewSx = {
  fontSize: 2,
  marginBottom: '40px',

  '.primaryColored': {
    color: 'primary',
  },

  '.social, .social:hover': {
    textDecoration: 'none',
    color: 'text',
  },

  '.profilePic': {
    width: '100%',
    marginBottom: '15px',
  },

  '@media (max-width: 700px)': {
    img: {
      height: 'auto',
      maxWidth: '500px',
    },
  },
};

class MatchView extends Component {
  state = {
    show: false,
    saved: false,
    reason: '',
    reportMessage: '',
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    // reset error and saved here to get rid of additional text
    this.setState({ [name]: value, error: false, saved: false });
  };

  // shows pop-up asking if they are sure they want to report
  preReport = () => {
    this.setState({ show: true });
  };

  report = () => {
    this.props.addToReportList(
      this.props.otherUid,
      this.props.uid,
      this.state.reportMessage,
      this.props.nextMatch,
    );
    this.setState({ show: false, reportMessage: '' });
  };

  reportModal = reportMessage => {
    return (
      <Modal
        onHide={() => this.setState({ show: false })}
        show={this.state.show}
      >
        <Modal.Body style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 20, fontWeight: 'bold' }}>
            Are you sure you want to report this user?
          </div>
          <br />
          <div style={{ fontSize: 14 }}>
            This action will block the reported account and permanently hide
            this conversation. The other user will not see any changes or be
            notified.
          </div>
          <br />
          <Input
            className="reportInput"
            name="reportMessage"
            handleInputChange={this.handleInputChange}
            placeholder="Reason (e.g. spam, inappropriate, hate speech)"
            value={reportMessage}
          />
          <br />
          <Button onClick={this.report}>I'm Sure</Button>
          <br />
          <br />
          <div
            onClick={() => this.setState({ show: false })}
            style={{ cursor: 'pointer' }}
          >
            Nevermind!
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  render() {
    const {
      hasMatched,
      initiateMatch,
      match,
      matchRef,
      matchStatus,
      otherUid,
      privateProfile,
      showButton,
      user,
      userTimes,
      userTimezone,
      onVisibilityChange,
    } = this.props;

    const { reportMessage } = this.state;

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

    return (
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
        <div sx={{ fontSize: 1 }} className="primaryColored">
          {rating
            ? `${(rating * 100).toFixed(2)}% ${love ? 'LOVE' : 'FRIENDSHIP'}`
            : ''}
        </div>
        <div sx={{ fontSize: 1 }} className="primaryColored">
          {canDate &&
            displayFreeDateMsg &&
            'Eligible for a free/discounted date!'}
        </div>
        {this.reportModal(reportMessage)}
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
        {getAvailableTime(userTimes, times, userTimezone)}
        <div>{meetPreference}</div>
        {socials.length !== 0 && <div>Reach me on {socials}</div>}
        <br />
        {showButton && (
          <Link to={`/app/messages/${otherUid}`} className="messageButton">
            <Button variant="primary">Message {name}</Button>
          </Link>
        )}{' '}
        <Button variant="secondary" onClick={this.preReport}>
          Report
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { reported } = state.firebase.data;
  const { uid } = state.firebase.auth;
  return {
    userTimes: (state.firebase.data.publicProfile || {}).times,
    userTimezone: (state.firebase.data.publicProfile || {}).timezone,
    privateProfile: (state.firebase.data.privateProfiles || {})[props.otherUid],
    reported: reported,
    updateProfile: updateProfiles(props.firebase.update, uid),
    uid: uid,
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

  firebaseConnect(props => [
    {
      path: '/matchCatalog/' + props.uid + '/' + props.otherUid + '/reported',
      storeAs: 'reported',
    },
  ]),

  connect(mapStateToProps),
)(MatchView);
