import React, { Component } from 'react';
import { Button } from 'theme-ui';
import { Link } from 'react-router-dom';
import MatchButton from 'components/MatchButton';
import SpotifyDisplay from 'components/SpotifyDisplay';
import ReactTooltip from 'react-tooltip';
//for report feature
import Input from 'components/Input';

//for pop-up feature
import Modal from 'react-bootstrap/Modal';

import { getAvailableTime } from 'utils/schedule';
import settings from 'constants/config.json';

class MobileMatchEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      outtake: 0,
      show: false,
      reportMessage: '',
    };
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    // reset error and saved here to get rid of additional text
    this.setState({ [name]: value, error: false, saved: false });
  };

  // shows pop-up asking if they are sure they want to report
  preReport = () => {
    this.setState({ show: true });
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
          <Button
            onClick={() =>
              this.props.addToReportList(
                this.props.otherUid,
                this.props.uid,
                this.state.reportMessage,
              )
            }
          >
            I'm Sure
          </Button>
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
      profile_pic,
      rating,
      love,
      canDate,
      showButton,
      name,
      verified,
      hasMatched,
      initiateMatch,
      match,
      matchStatus,
      otherUid,
      college,
      location,
      year,
      dorm,
      pronouns,
      gender,
      description,
      outtakes,
      spotifyTopArtists,
      userTimes,
      times,
      userTimezone,
      meetPreference,
      socials,
      handleClose,
    } = this.props;

    const nextOuttake = takes => {
      this.setState(({ outtake }) => ({
        outtake: (outtake + 1) % takes.length,
      }));
    };

    const backOuttake = takes => {
      this.setState(({ outtake }) => ({
        outtake: Math.abs((outtake - 1) % takes.length),
      }));
    };

    const renderOuttake = () => {
      const filteredOuttakes = outtakes.filter(take => take);
      const take = filteredOuttakes[this.state.outtake];
      if (filteredOuttakes.length === 0) {
        return null;
      }

      if (filteredOuttakes.length === 1) {
        return (
          <div className="outtakes">
            <span className="outtakesBox">{take}</span>
          </div>
        );
      }
      return (
        <div className="outtakes">
          <button
            className="outtakes-arrow"
            type="input"
            onClick={() => backOuttake(filteredOuttakes)}
          >
            <i className="fas fa-chevron-left" />
          </button>
          <span className="outtakesBox">{take}</span>
          <button
            className="outtakes-arrow"
            type="input"
            onClick={() => nextOuttake(filteredOuttakes)}
          >
            <i className="fas fa-chevron-right" />
          </button>
        </div>
      );
    };

    const displayFreeDateMsg =
      settings.college_to_dateOption[college] &&
      settings.college_to_dateOption[college].length !== 0;

    return (
      <div className="popup-box">
        <div className="box">
          <div className="entry-top">
            <button className="close-icon" type="input" onClick={handleClose}>
              <i
                type="input"
                onClick={handleClose}
                className="fas fa-window-close"
              />
            </button>
            <div className="section-img-entry">
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
              <div style={{ fontSize: 12 }} className="primaryColored">
                {rating
                  ? `${(rating * 100).toFixed(2)}% ${
                      love ? 'LOVE' : 'FRIENDSHIP'
                    }`
                  : 'Search Matched'}
              </div>
              <div style={{ fontSize: 12 }} className="primaryColored">
                {canDate &&
                  displayFreeDateMsg &&
                  'Eligible for a free/discounted date!'}
              </div>

              <div className="name">
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
              <br />
              {college}
              {year && ' ' + year}
              {location &&
                ', ' +
                  (location.campusLocation === 'on-campus'
                    ? dorm || ''
                    : location.state || location.country || '')}
              <br />
              {pronouns && pronouns.map(pronoun => pronoun)}
            </div>
          </div>
          <br />

          {this.reportModal(this.state.reportMessage)}

          <div className="entry-bottom">
            <div className="expand-entry-buttons">
              <div className="individual-button">
                <span className="margin-spacing">
                  {showButton && (
                    <MatchButton
                      hasMatched={hasMatched}
                      initiateMatch={initiateMatch}
                      match={match}
                      matchStatus={matchStatus}
                      otherUid={otherUid}
                    />
                  )}
                </span>

                <span className="margin-spacing">
                  {showButton && (
                    <Link
                      to={`/app/messages/${otherUid}`}
                      className="messageButton"
                    >
                      <Button variant="primary">Message</Button>
                    </Link>
                  )}
                </span>

                <span className="margin-spacing">
                  {showButton && (
                    <Button variant="secondary" onClick={this.preReport}>
                      Report
                    </Button>
                  )}
                </span>
              </div>
            </div>

            {gender && gender.optional && <div>{gender.optional}</div>}
            <br />
            <div>{description}</div>
            {description && <br />}
            {outtakes && renderOuttake()}
            <br />
            <br />
            {spotifyTopArtists ? (
              <SpotifyDisplay objects={spotifyTopArtists} />
            ) : null}
            {spotifyTopArtists && <br />}
            {getAvailableTime(userTimes, times, userTimezone)}
            <div>{meetPreference}</div>
            {socials.length !== 0 && <div>Reach me on {socials}</div>}
            <br />
          </div>
        </div>
      </div>
    );
  }
}

export default MobileMatchEntry;
