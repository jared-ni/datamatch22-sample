/** @jsx jsx */

import { Component, Fragment } from 'react';
import { jsx, Button } from 'theme-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  firebaseConnect,
  firestoreConnect,
  isLoaded,
} from 'react-redux-firebase';
import Modal from 'react-bootstrap/Modal';
import Collapse from 'react-bootstrap/Collapse';

import Select from 'components/Select';
import { getAvailableTime } from 'utils/schedule';
import ReactTooltip from 'react-tooltip';

const datesSx = {
  '.blue-background': {
    background: theme => `${theme.colors.blue}`,
  },

  '.pink-background': {
    background: theme => `${theme.colors.pink}`,
  },

  '.date-banner': {
    textAlign: 'center',
    padding: '10px',
    fontSize: '14px',
    fontWeight: '450',
    color: 'white',
  },

  '.view-modal': {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

const modalSx = {
  '.modal-body': {},

  '.description': {
    marginBottom: '20px',
  },

  '.when-container, .where-container': {
    marginBottom: '20px',
  },

  '.when-container': {
    display: 'flex',
    flexWrap: 'wrap',
  },

  '.error-message': {
    color: 'pink',
    fontStyle: 'italic',
  },

  '.background-border': {
    background: 'white',
    border: theme => `0.5px solid ${theme.colors.mediumGrey}`,
    boxSizing: 'border-box',
    borderRadius: '3px',
  },

  '.where-select': {
    width: '290px',
  },

  '.when-select': {
    width: '140px',
  },

  '.select': {
    height: '36px',
    marginTop: '5px',
    marginRight: '10px',
    padding: '1px 10px 1px 10px',

    backgroundImage: `url("${window.location.origin}/angle-down.png")`,
    backgroundPosition: '95% 60%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
  },

  '.date-option-description': {
    marginTop: '10px',
  },
};

class Dates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDateModal: false,
      dateOptionId: null,
      dayStr: null,
      time: null,
      bannerHeight: null,
    };
  }

  resizeBanner = () => {
    const height = document.getElementById('banner').clientHeight;
    if (height !== this.state.bannerHeight) {
      this.setState({ bannerHeight: height });
      this.props.getBannerHeight(height);
    }
  };

  componentDidMount = () => {
    window.addEventListener('resize', this.resizeBanner);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resizeBanner);
  };

  componentDidUpdate = () => {
    this.resizeBanner();
    const { match } = this.props;
    if (
      match.dateInfo?.dateOptionId &&
      this.state.dateOptionId !== match.dateInfo?.dateOptionId
    ) {
      this.setState({ dateOptionId: match.dateInfo.dateOptionId });
    }
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    const updates = { [name]: value };
    if (name === 'dateOptionId') {
      updates.dayStr = null;
      updates.time = null;
    }
    this.setState(updates);
  };

  toggleDateModal = value => this.setState({ showDateModal: value });

  suggestDate = async () => {
    const {
      dateOptions,
      firebase,
      matchId,
      incrementUnread,
      updateMessages,
    } = this.props;
    this.toggleDateModal(false);

    const { dateOptionId, dayStr, time } = this.state;
    const day = parseInt(dayStr);
    const dateOptionName = dateOptions[dateOptionId].name;
    let updates = { dateOptionId, day, time, invited: this.props.uid };

    try {
      await firebase.update(`/matches/${matchId}/dateInfo/`, updates);
      updateMessages(
        `Date suggestion: ${dateOptionName} at ${time} on 2/${day + 14}.`,
        true,
      );
      incrementUnread();
    } catch {
      alert('The invite could not be confirmed, please try again!');
    }
  };

  confirmDate = async () => {
    this.toggleDateModal(false);

    const {
      dateOptions,
      matchId,
      firebase,
      match,
      uid,
      incrementUnread,
      updateMessages,
    } = this.props;
    const { day, dateOptionId } = match.dateInfo;

    const countUpdates = {};
    // For all types of codes, confirm date
    countUpdates[`/matches/${matchId}/dateInfo/confirmed`] = true;
    // For non-multiuse codes, decrement `total`
    if (dateOptions[dateOptionId].codeType !== 'multiuse') {
      countUpdates[`/dateOptions/${dateOptionId}/total`] =
        dateOptions[dateOptionId].total - 1;
    }
    // For generated codes, update `datesAvailable`
    if (dateOptions[dateOptionId].codeType === 'generated') {
      countUpdates[`/dateOptions/${dateOptionId}/days/${day}/datesAvailable`] =
        dateOptions[dateOptionId].days[day].datesAvailable - 1;
      // For firebase rules
      countUpdates[
        `/dateOptions/${dateOptionId}/days/${day}/claimingMatch`
      ] = matchId;
    }
    // For provided codes, claimingMatch is not day-specific
    if (dateOptions[dateOptionId].codeType === 'provided') {
      countUpdates[`/dateOptions/${dateOptionId}/claimingMatch`] = matchId;
    }
    // For firebase rules
    countUpdates[`/dateOptions/${dateOptionId}/claimingDay`] = day;

    const uids = matchId.split('-');
    const otherUid = uids[0] === uid ? uids[1] : uids[0];

    try {
      await firebase.update('/', countUpdates);
      await firebase.functions().httpsCallable('email-notifyDate')({
        ...match.dateInfo,
        matchId,
        uid,
        otherUid,
        description: dateOptions[dateOptionId].description,
        address: dateOptions[dateOptionId].address,
      });
      updateMessages(`Date suggestion accepted.`, true);
      incrementUnread();
    } catch {
      alert('The date could not be confirmed, please try again!');
    }
  };

  cancelDate = async () => {
    this.toggleDateModal(false);

    const {
      dateOptions,
      matchId,
      firebase,
      match,
      uid,
      incrementUnread,
      updateMessages,
    } = this.props;
    const { day, dateOptionId } = match.dateInfo;

    const countUpdates = {};
    // For non-multiuse codes, update `total`
    if (dateOptions[dateOptionId].codeType !== 'multiuse') {
      countUpdates[`/dateOptions/${dateOptionId}/total`] =
        dateOptions[dateOptionId].total + 1;
    }
    // For generated codes, update `datesAvailable`
    if (dateOptions[dateOptionId].codeType === 'generated') {
      countUpdates[`/dateOptions/${dateOptionId}/days/${day}/datesAvailable`] =
        dateOptions[dateOptionId].days[day].datesAvailable + 1;
      // For firebase rules
      countUpdates[
        `/dateOptions/${dateOptionId}/days/${day}/cancellingMatch`
      ] = matchId;
    }
    // For provided codes, cancellingMatch is not day-specific
    if (dateOptions[dateOptionId].codeType === 'provided') {
      countUpdates[`/dateOptions/${dateOptionId}/cancellingMatch`] = matchId;
    }
    // For all codes, update `confirmed`
    countUpdates[`/matches/${matchId}/dateInfo/confirmed`] = null;

    // For firebase rules
    countUpdates[`/dateOptions/${dateOptionId}/cancellingDay`] = day;

    const uids = matchId.split('-');
    const otherUid = uids[0] === uid ? uids[1] : uids[0];

    try {
      await firebase.update('/', countUpdates);
      // remove other parts of the dateInfo afterwards
      await firebase.update(`/matches/${matchId}`, { dateInfo: null });
      await firebase.functions().httpsCallable('email-notifyDateCancel')({
        ...match.dateInfo,
        matchId,
        uid,
        otherUid,
      });
      updateMessages(`Date cancelled.`, true);
      incrementUnread();
    } catch {
      alert('The date could not be cancelled, please try again!');
    }
  };

  cancelInvite = async () => {
    this.toggleDateModal(false);

    const { matchId, firebase, incrementUnread, updateMessages } = this.props;

    const updates = {};
    updates[`/matches/${matchId}/dateInfo/`] = null;
    try {
      await firebase.update('/', updates);
      updateMessages(`Date suggestion declined.`, true);
      incrementUnread();
    } catch {
      alert('The invite could not be cancelled, please try again!');
    }
  };

  checkDateAvailable = (dateOptionId, dayStr) => {
    const now = Date.now();
    const timeScheduled = Date.parse(
      String(parseInt(dayStr) + 14) + ' Feb 2022 10:00:00 GMT',
    );

    const { dateOptions } = this.props;
    const dateOptionInfo = dateOptions[dateOptionId] || '';
    const codeType = dateOptionInfo ? dateOptionInfo.codeType : '';

    if (dayStr && timeScheduled - now + 86400000 < 0) {
      return 'Dates cannot be scheduled for the past';
    }

    if (
      dateOptionId &&
      codeType !== 'multiuse' &&
      dateOptions[dateOptionId].total <= 0
    ) {
      return 'No more dates available for selected date option :(';
    }

    if (
      dateOptionId &&
      dayStr &&
      codeType === 'generated' &&
      dateOptions[dateOptionId].days[dayStr].datesAvailable <= 0
    ) {
      return 'No dates available on this day :(';
    }

    return null;
  };

  render() {
    const {
      dateOptions,
      dateOptionIds,
      match,
      otherName,
      otherTimes,
      uid,
      userTimes,
      userTimezone,
    } = this.props;

    const { dateOptionId, dayStr, time } = this.state;

    // this is quite sus, but
    if (
      !isLoaded(dateOptions) ||
      !isLoaded(dateOptionIds) ||
      Object.keys(dateOptions).length !== dateOptionIds.length
    ) {
      return <div id="banner"></div>;
    }

    const dateInfo = match.dateInfo || {};

    const times = dateOptions[dateOptionId]?.times || [
      '11:00AM',
      '12:00PM',
      '1:00PM',
      '2:00PM',
      '3:00PM',
      '4:00PM',
      '5:00PM',
      '6:00PM',
      '7:00PM',
      '8:00PM',
    ];

    const dateOptionNames = Object.values(dateOptions).map(dateOptionValue =>
      dateOptionValue && dateOptionValue.name ? dateOptionValue.name : '',
    );

    // unavailable is a message string when date unavailable, else null
    const unavailable = this.checkDateAvailable(dateOptionId, dayStr);

    const disabled = !dateOptionId || !time || !dayStr || unavailable;

    const dateOptionDisplay =
      Object.keys(dateInfo).length === 0 || !(dateOptionId in dateOptions)
        ? ''
        : dateOptions[dateInfo.dateOptionId].name;

    let dateOptionDescription = dateOptions[dateOptionId] &&
      dateOptions[dateOptionId].description && (
        <div className="date-option-description">
          <b>Date: </b>
          {dateOptions[dateOptionId].description}
        </div>
      );

    let websiteDescription = dateOptions[dateOptionId] &&
      dateOptions[dateOptionId].url && (
        <a
          href={dateOptions[dateOptionId].url}
          target="_blank"
          rel="noreferrer"
        >
          Website
        </a>
      );

    const addressDescription = dateOptions[dateOptionId] &&
      dateOptions[dateOptionId].address && (
        <div>
          <b>Address: </b>
          {dateOptions[dateOptionId].address}
        </div>
      );

    const hoursDescription = dateOptions[dateOptionId] &&
      dateOptions[dateOptionId].hours && (
        <div>
          <b>Hours: </b>
          {dateOptions[dateOptionId].hours}
        </div>
      );

    const imageDescription = dateOptions[dateOptionId] &&
      dateOptions[dateOptionId].logo && (
        <div style={{ textAlign: 'center' }}>
          <br />
          <img
            src={dateOptions[dateOptionId].logo}
            style={{ width: '100px' }}
            alt="logo"
          />
          <br />
        </div>
      );

    const codeDescription = dateInfo && dateInfo.confirmed && dateInfo.code && (
      <div>
        <b>Code: {this.props.match.dateInfo.code}</b>
      </div>
    );

    const fullDateDescription = (
      <div>
        {codeDescription}
        {dateOptionDescription}
        {addressDescription}
        {hoursDescription}
        {websiteDescription}
        {imageDescription}
      </div>
    );

    const dayIndexes = [0, 1, 2, 3, 4, 5, 6].filter(
      day =>
        !dateOptionId ||
        dateOptions[dateOptionId].codeType !== 'generated' ||
        dateOptions[dateOptionId].days[day].datesAvailable > 0,
    );

    const dayLabels = [
      '2/14',
      '2/15',
      '2/16',
      '2/17',
      '2/18',
      '2/19',
      '2/20',
    ].filter((__day, index) => dayIndexes.includes(index));

    // CONFIRMED DATE
    if (dateInfo.confirmed) {
      const now = Date.now();
      const timeScheduled = Date.parse(
        String(dateInfo.day + 14) + ' Feb 2022 10:00:00 GMT',
      );

      const canCancel =
        timeScheduled - now > 0 &&
        dateOptions[dateOptionId] &&
        dateOptions[dateOptionId].name !== 'Snackpass (Existing Users Only!)';

      return (
        <div sx={datesSx}>
          <div className="date-banner pink-background" id="banner">
            <div>
              Congrats, you've scheduled a date at {dateOptionDisplay} at{' '}
              {dateInfo.time} on 2/{14 + dateInfo.day}{' '}
            </div>
            <div
              onClick={() => this.toggleDateModal(true)}
              className="view-modal"
            >
              View date details
            </div>
          </div>
          <Modal
            centered
            onHide={() => this.toggleDateModal(false)}
            show={this.state.showDateModal}
            sx={modalSx}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {dateOptionDisplay} at {dateInfo.time} on 2/
                {14 + dateInfo.day}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* TODO: link covid guidelines */}
              <div className="description">
                <div>
                  {fullDateDescription}
                  Have fun, and make sure to follow your state’s COVID
                  precautions!
                </div>
              </div>
              {canCancel && (
                <Fragment>
                  <br />
                  <Button onClick={this.cancelDate} variant="secondary">
                    Cancel Date
                  </Button>
                  <div className="error-message">
                    Note: the latest you can cancel a date is 5am ET the day of.
                  </div>
                </Fragment>
              )}
            </Modal.Body>
          </Modal>
        </div>
      );
    }

    // PENDING INVITE
    if (dateInfo.invited) {
      // Pending invite from user
      if (dateInfo.invited === uid) {
        return (
          <div sx={datesSx}>
            <div className="date-banner blue-background" id="banner">
              We'll reserve your date when {otherName} accepts.
              <div
                onClick={() => this.toggleDateModal(true)}
                className="view-modal"
              >
                View invitation
              </div>
            </div>
            <Modal
              centered
              onHide={() => this.toggleDateModal(false)}
              show={this.state.showDateModal}
              sx={modalSx}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {dateOptionDisplay} at {dateInfo.time} on 2/
                  {14 + dateInfo.day}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {fullDateDescription}
                <br />
                <div className="description">
                  We'll reserve your date when {otherName} accepts.
                </div>
                <Button onClick={this.cancelInvite} variant="secondary">
                  Cancel invitation
                </Button>
              </Modal.Body>
            </Modal>
          </div>
        );
      }

      const inviteDisabled = this.checkDateAvailable(
        dateInfo.dateOptionId,
        dateInfo.day,
      );

      // Pending invite from other person
      return (
        <div sx={datesSx}>
          <div className="date-banner blue-background" id="banner">
            <div>
              {otherName} invited you to a date at {dateOptionDisplay} on 2/
              {14 + dateInfo.day} at {dateInfo.time}
            </div>
            <div
              onClick={() => this.toggleDateModal(true)}
              className="view-modal"
            >
              View invitation
            </div>
          </div>
          <Modal
            centered
            onHide={() => this.toggleDateModal(false)}
            show={this.state.showDateModal}
            sx={modalSx}
          >
            <Modal.Header closeButton>
              <Modal.Title>Accept the date</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="description">
                <div>
                  {otherName} suggested a date at {dateOptionDisplay} on{' '}
                  {dateInfo.time} on 2/{14 + dateInfo.day}.
                </div>
                {fullDateDescription}
                <br />
                If you accept, we’ll reserve a spot for you. If you decline, you
                can propose something else.
                {dateInfo.day === 0 && (
                  <Fragment>
                    <br />
                    <br />
                    <div className="error-message">
                      Note: you cannot cancel a date scheduled on Valentine's
                      day.
                    </div>
                  </Fragment>
                )}
                {inviteDisabled && (
                  <Fragment>
                    <br />
                    <br />
                    <div className="error-message">
                      {inviteDisabled + ' Please decline and try again.'}
                    </div>
                  </Fragment>
                )}
              </div>
              <Button
                disabled={false}
                onClick={this.confirmDate}
                sx={{ marginRight: 3 }}
                variant={inviteDisabled ? 'primary' : 'primary'}
              >
                Accept
              </Button>
              <Button onClick={this.cancelInvite} variant="secondary">
                Decline
              </Button>
            </Modal.Body>
          </Modal>
        </div>
      );
    }

    // NO INVITES
    return (
      <div sx={datesSx}>
        <div className="date-banner blue-background" id="banner">
          You're eligible for a free/discounted date with {otherName}, paid for
          by Datamatch!
          <div
            onClick={() => this.toggleDateModal(true)}
            className="view-modal"
          >
            View date options
          </div>
        </div>
        <Modal
          centered
          onHide={() => this.toggleDateModal(false)}
          show={this.state.showDateModal}
          sx={modalSx}
        >
          <Modal.Header closeButton>
            <Modal.Title>Schedule a Date</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="description">
              If {otherName} accepts the request, we’ll reserve the date for
              you!
              <br />
              <br />
              {getAvailableTime(userTimes, otherTimes, userTimezone)}
            </div>
            {/* using the double negative to get rid of warning on browser */}
            <div>
              <b>Where</b>
              <div className="where-container">
                <Select
                  className="where-select select background-border"
                  handleInputChange={this.handleInputChange}
                  labels={dateOptionNames}
                  name="dateOptionId"
                  placeholder="Options"
                  values={Object.keys(dateOptions)}
                  value={this.state.dateOptionId}
                />
                <Collapse in={!!dateOptionId}>
                  <div className="dateOptionDescription">
                    {fullDateDescription}
                  </div>
                </Collapse>
              </div>
              <b>When </b>
              <span
                data-tip={
                  'Sponsored dates are allotted day-by-day. The time is just for you & your match’s convenience!'
                }
              >
                <i className="fas fa-info-circle info-icon"></i>
                <ReactTooltip place="right" multiline={true} />
              </span>
              <div className="when-container">
                <Select
                  className="when-select select background-border"
                  handleInputChange={this.handleInputChange}
                  labels={dayLabels}
                  name="dayStr"
                  placeholder="Date"
                  // these values will be converted to strings
                  values={dayIndexes}
                  value={this.state.dayStr}
                />
                <Select
                  className="when-select select background-border"
                  handleInputChange={this.handleInputChange}
                  labels={times}
                  name="time"
                  placeholder="Time"
                  values={times}
                  value={this.state.time}
                />
              </div>
              <div className="error-message">{unavailable}</div>
              <br />
              <Button
                onClick={this.suggestDate}
                disabled={disabled}
                variant={disabled ? 'disabled' : 'primary'}
              >
                Suggest date
              </Button>
              <br />
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { college, otherUid } = props;
  const firestoreData = state.firestore.data.config || {};
  return {
    dateOptionIds:
      Object.keys(firestoreData).length === 0
        ? []
        : firestoreData.college_to_dateOption[college],
    dateOptions: state.firebase.data.dateOptions,
    college: state.firebase.profile.college,
    otherCollege: state.firebase.data.profiles[otherUid].college,
    otherTimes: state.firebase.data.profiles[otherUid].times,
    userTimes: (state.firebase.data.publicProfile || {}).times,
    userTimezone: (state.firebase.data.publicProfile || {}).timezone,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: 'settings',
      doc: 'config',
      storeAs: 'config',
    },
  ]),

  firebaseConnect(({ dateOptionIds }) => {
    if (dateOptionIds) {
      let dateOptionPaths = [];
      dateOptionIds.forEach(dateOptionId => {
        dateOptionPaths.push({
          path: `/dateOptions/${dateOptionId}`,
        });
      });
      return dateOptionPaths;
    } else {
      return [];
    }
  }),
)(Dates);
