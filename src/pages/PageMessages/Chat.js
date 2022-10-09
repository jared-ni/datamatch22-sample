/** @jsx jsx */

import React, { Component } from 'react';
import { jsx } from 'theme-ui';
import { Button } from 'theme-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import Dates from 'components/Dates';
import NotifBanner from 'components/NotifBanner';
import UnsponsoredDates from 'components/UnsponsoredDates';
import MatchButton from 'components/MatchButton';
import { headerHeight } from 'constants/Navbar';
import { getMatchId, makeMatch } from 'utils/match';

import { matchChatSx, chatSx } from 'pages/PageMessages/PageMessagesStyles';

class Chat extends Component {
  messagesEnd = React.createRef();
  state = {
    message: '',
    bannerHeight: '',
    notifBannerHeight: 0,
    clickTimestamp: '',
    newTapEvent: 0,
  };

  // Scroll to the bottom of the chat
  scrollToBottom = () => {
    if (this.messagesEnd.current) {
      this.messagesEnd.current.scrollIntoView();
    }
  };

  componentDidMount() {
    const { unread, zeroUnread } = this.props;
    // mark chat as read if unread
    if (unread) {
      zeroUnread();
    }
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO: Don't always scroll to bottom on update.
    // Instead, have some kind of "would you like to
    // scroll to bottom" indicator on receiving new messages.
    // This is because typing a message will cause scroll to bottom.

    // If it is not a new tap event on the chat, scroll to the Bottom
    // This is to make sure that the scrollToBottom is not called for all events.
    if (prevState.newTapEvent === this.state.newTapEvent) {
      this.scrollToBottom();
    }

    // mark chat as read if unread
    const { unread, zeroUnread } = this.props;
    // mark chat as read if unread
    if (unread) {
      zeroUnread();
    }
  }

  getBannerHeight = height => {
    this.setState({ bannerHeight: height });
  };

  getNotifBannerHeight = height => {
    this.setState({ notifBannerHeight: height });
  };

  // Send the message and update the unread status of both users
  sendMessage = e => {
    e.preventDefault();
    const { incrementUnread, updateMessages } = this.props;
    const message = this.state.message.trim();
    if (message.length > 0) {
      updateMessages(message);
      incrementUnread();
      this.setState({ message: '' });
    }
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  mobileProfileBanner = () => {
    if (this.props.mobile) {
      return (
        <div
          style={{
            verticalAlign: 'middle',
          }}
        >
          {
            <div
              style={{
                backgroundColor: '#f5e3e3',
                padding: '5px 13px',
                position: 'fixed',
                width: '100%',
                margin: '10px',
                top: '60px',
                left: '-10px',
                zIndex: '2',
              }}
            >
              <div
                onClick={this.props.toggleSidebar}
                style={{
                  display: 'inline-block',
                  top: '5px',
                  position: 'relative',
                }}
              >
                <i
                  className="fas fa-angle-left"
                  style={{
                    fontSize: 30,
                  }}
                />
              </div>
              <div
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  top: '-2px',
                  marginLeft: '15px',
                  fontWeight: 'bold',
                }}
              >
                <img
                  alt="profile pic"
                  className="view-profilePic"
                  src={
                    this.props.profile_pic ||
                    require('assets/empty.png').default
                  }
                  sx={{
                    objectFit: 'cover',
                    background: `url(${require('assets/loading.svg').default})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                />
                {this.props.otherName}
              </div>
            </div>
          }
        </div>
      );
    }
  };

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

  // Add date to the set if it's not already there, then return a date box
  renderDate = (timestamp, dates) => {
    // Add to the set so that it doesn't render again
    let sentDate = new Date(timestamp);
    let sentDateLocal = sentDate.toLocaleDateString();

    // Check if in dates set
    if (dates.has(sentDateLocal)) {
      return null;
    } else {
      // If not, add it to the set and display the date
      dates.add(sentDateLocal);

      // If sent today, display today
      let todayDate = new Date();
      if (sentDateLocal === todayDate.toLocaleDateString()) {
        return <div className="dateDisplay">{'Today'}</div>;
      }

      // Return <div className="dateDisplay">{todayDate - sentDateLocal}</div>;
      return <div className="dateDisplay">{sentDateLocal}</div>;
    }
  };

  renderTime = timestamp => {
    // Get date and time
    let sentDate = new Date(timestamp);
    return sentDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Message style rendered if on desktop
  renderDesktop = message => {
    return (
      <div>
        <div
          className={
            'messageText' + (message.autogenerated ? ' autogenerated' : '')
          }
        >
          {message.text}
        </div>
        <div className="messageTime">{this.renderTime(message.timestamp)}</div>
      </div>
    );
  };

  // Message style rendered if on mobile
  renderMobile = message => {
    // Save timestamp to state
    const renderClickedTime = () => {
      // If timestamp matches (reclicked a textbox), delete state timestamp
      if (message.timestamp === this.state.clickTimestamp) {
        this.setState({
          clickTimestamp: '',
          newTapEvent: this.state.newTapEvent - 1,
        });
      } else {
        // If timestamp is different, update state timestamp
        this.setState({
          clickTimestamp: message.timestamp,
          newTapEvent: this.state.newTapEvent + 1,
        });
      }
    };

    return (
      <div onClick={() => renderClickedTime()}>
        <text
          className={
            'messageText' + (message.autogenerated ? ' autogenerated' : '')
          }
        >
          {message.text}
        </text>
        {message.timestamp === this.state.clickTimestamp ? (
          <text className="messageTime">
            {this.renderTime(message.timestamp)}
          </text>
        ) : null}
      </div>
    );
  };

  render() {
    const {
      college,
      dismissNotifBanner,
      hasMatched,
      match,
      matchId,
      matchStatus,
      messages,
      otherName,
      otherUid,
      showNotifBanner,
      uid,
      user,
    } = this.props;

    // Stores the set of dates to be displayed (groups messages by date)
    const dates = new Set();

    const showSponsoredDates =
      college !== 'Harvard' ? match?.canDate : !match?.searchMatch;

    if (!hasMatched) {
      return (
        <div sx={matchChatSx}>
          {this.mobileProfileBanner()}
          <div>
            <div className="description">
              To be able to message {otherName}, press
            </div>
            <MatchButton
              hasMatched={hasMatched}
              initiateMatch={this.initiateMatch}
              match={match}
              matchStatus={matchStatus}
              otherUid={otherUid}
            />
          </div>
        </div>
      );
    } else if (!matchStatus) {
      return (
        <div sx={matchChatSx}>
          {this.mobileProfileBanner()}
          <div>
            <div style={{ color: '#d7525b', marginBottom: 10 }}>
              Match pending...
            </div>
            <div className="description">
              You'll be able to message each other once {otherName} matches
              back.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div sx={chatSx}>
        <NotifBanner
          dismissNotifBanner={dismissNotifBanner}
          getNotifBannerHeight={this.getNotifBannerHeight}
          showNotifBanner={showNotifBanner}
        />
        {this.mobileProfileBanner()}
        <div
          className="messagesContainer"
          style={{
            height: `calc(100vh - ${headerHeight}px - 70px - ${this.state.bannerHeight}px - ${this.state.notifBannerHeight}px)`,
            paddingTop: '45px',
          }}
        >
          {messages &&
            messages.map(message => {
              // True if sender is current user, false if other user
              const sender = user === message.value.name;

              return (
                <div key={message.key}>
                  {this.renderDate(message.value.timestamp, dates)}

                  <div
                    className="message"
                    style={{
                      /* Align the messages based on sender. */
                      textAlign: sender ? 'right' : 'left',
                    }}
                  >
                    {
                      // If not mobile, render Desktop message type. Else render Mobile
                      !this.props.mobile
                        ? this.renderDesktop(message.value)
                        : this.renderMobile(message.value)
                    }
                  </div>
                </div>
              );
            })}
          {/* Used to determine where the bottom of the chat is */}
          <div ref={this.messagesEnd} />
        </div>
        {showSponsoredDates ? (
          <Dates
            college={college}
            getBannerHeight={this.getBannerHeight}
            incrementUnread={this.props.incrementUnread}
            match={match}
            matchId={matchId}
            otherName={otherName}
            otherUid={otherUid}
            uid={uid}
            updateMessages={this.props.updateMessages}
          />
        ) : (
          <UnsponsoredDates
            college={college}
            getBannerHeight={this.getBannerHeight}
            incrementUnread={this.props.incrementUnread}
            match={match}
            matchId={matchId}
            otherName={otherName}
            otherUid={otherUid}
            uid={uid}
            updateMessages={this.props.updateMessages}
          />
        )}
        <div className="chatbox">
          <form style={{ display: 'flex' }}>
            <input
              className="textbox"
              name="message"
              autoComplete="none"
              onChange={this.handleInputChange}
              placeholder="Type something"
              value={this.state.message}
            />
            <Button
              className="sendButton"
              onClick={this.sendMessage}
              type="submit"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { matchId, otherUid, user } = props;
  const { functions, push, ref, update } = props.firebase;
  const {
    auth: { uid },
    ordered: { messages },
    profile: { name },
  } = state.firebase;

  return {
    makeMatch: makeMatch(update, uid),
    messages: (messages || {})[matchId],
    name,
    uid,
    updateMessages: (text, autogenerated = null) => {
      // Timestamp in UTC
      let timestamp = new Date().getTime();

      push('/messages/' + matchId, {
        text,
        name: user,
        timestamp,
        autogenerated,
      });
      // Send unread notification to other user
      functions().httpsCallable('notifs-newMessageNotif')({ otherUid });
    },
    incrementUnread: () => {
      ref(`/matchCatalog/${otherUid}/${uid}/unread`).transaction(x => x + 1);
    },
    zeroUnread: () => {
      ref(`/matchCatalog/${uid}/${otherUid}/unread`).transaction(() => 0);
    },
  };
};

export default compose(
  firebaseConnect(({ hasMatched, matchId, matchStatus }) =>
    // Only pull messages if both people have matched
    matchStatus && hasMatched
      ? [
          {
            path: '/messages/' + matchId,
            queryParams: ['limitToLast=100'],
          },
        ]
      : [],
  ),
  connect(mapStateToProps),
)(Chat);
