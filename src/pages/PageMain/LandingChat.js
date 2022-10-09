/** @jsx jsx */

import React, { Component } from 'react';
import { jsx } from 'theme-ui';
import { firebaseConnect } from 'react-redux-firebase';

import colleges from 'constants/Colleges';

import ChatLookingFor from 'pages/PageMain/ChatLookingFor';
import ChatNowServing from 'pages/PageMain/ChatNowServing';
import ChatRedFlag from 'pages/PageMain/ChatRedFlag';
import ChatQuestion from 'pages/PageMain/ChatQuestion';
import ChatStatistic from 'pages/PageMain/ChatStatistic';

import landingQuestions from 'assets/landing_page/landing-questions.json';
import redFlags from 'constants/RedFlags';
import landingStatistics from 'assets/landing_page/landing-stats.json';

import { landingChatSx } from 'pages/PageMain/PageMainStyles';

const landingLookingFor = [
  'some jokes',
  'matches to stalk',
  'human interaction',
  'a soulmate',
];

const yearToClass = year => {
  const map = {
    2022: 'senior',
    2023: 'junior',
    2024: 'sophomore',
    2025: 'freshman',
  };
  return map[year] || 'grad';
};

const isInViewport = element => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const ChatMessage = ({ message, index, mobile }) => {
  const type = message.type;
  return (
    <div
      style={{
        opacity: index === 0 ? 0.5 : 1,
        marginLeft: mobile ? 'auto' : 0,
        marginRight: mobile ? 'auto' : 0,
      }}
    >
      {type === 'lookingFor' ? (
        <ChatLookingFor message={message} />
      ) : type === 'nowServing' ? (
        <ChatNowServing message={message} />
      ) : type === 'question' ? (
        <ChatQuestion message={message} />
      ) : type === 'redFlag' ? (
        <ChatRedFlag message={message} />
      ) : (
        <ChatStatistic message={message} />
      )}
    </div>
  );
};

class LandingChat extends Component {
  messagesEnd = React.createRef();
  messagesStart = React.createRef();

  state = {
    _isMounted: false,
    numMessages: 10,
    userMessages: [],
  };

  // Scroll to the bottom of the chat
  scrollToBottom = () => {
    if (
      this.messagesEnd.current &&
      this.messagesStart.current &&
      isInViewport(this.messagesStart.current)
    ) {
      this.messagesEnd.current.scrollIntoView(false);
    }
  };

  // update window dimensions and sidebar properties
  updateWindowDimensions = () => {
    // sorry about the hardcode this was like impossible to do otherwise :(
    // TODO: add all school logos and prompts
    // const height = this.props.mobile
    //   ? window.innerHeight - 360 - 140
    //   : window.innerHeight;
    this.scrollToBottom();
  };

  componentDidMount() {
    this._isMounted = true;
    this.updateWindowDimensions();
    // resize handler event listener
    window.addEventListener('resize', this.updateWindowDimensions);

    this.initMessages();
  }

  componentDidUpdate(prevProps) {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // chooses a random type and random contents for a given message
  getRandomMessageData = ({ college, year }) => {
    const rand = Math.floor(Math.random() * 100);
    let data = {};

    if (rand < 70 && landingQuestions?.surveys?.[college]?.['survey']) {
      const survey = landingQuestions.surveys[college]['survey'];
      const idx = Math.floor(Math.random() * survey.length);
      const question = survey[idx]['text'];
      const answer = survey[idx]['answers'][Math.floor(Math.random() * 5)];
      data = { type: 'question', question, answer };
    } else if (rand < 75) {
      data = {
        type: 'redFlag',
        text: redFlags[Math.floor(Math.random() * redFlags.length)],
      };
    } else if (rand < 80) {
      data = {
        type: 'lookingFor',
        text:
          landingLookingFor[
            Math.floor(Math.random() * landingLookingFor.length)
          ],
      };
    } else if (rand < 85) {
      data.type = 'nowServing';
    } else {
      const { statistics } = landingStatistics;
      data = {
        type: 'statistic',
        ...statistics[Math.floor(Math.random() * statistics.length)],
      };
    }

    return data;
  };

  // setinterval for something random
  initMessages = async () => {
    // we want to do this manually b/c we only want to pull from messages once
    const userMessages = await this.props.firebase
      .database()
      .ref('landing')
      .limitToLast(200)
      .once('value');
    const formattedUserMessages = [];
    userMessages.forEach(snapshot => {
      let msg = snapshot.val();
      if (!colleges.includes(msg.college)) {
        return;
      }
      formattedUserMessages.push({
        sender: `${yearToClass(msg.year)} @ ${msg.college.toLowerCase()}`,
        icon: `${msg.college.toLowerCase()}.png`,
        college: msg.college,
        ...this.getRandomMessageData(msg),
      });
    });
    // doubled the array
    this._isMounted &&
      this.setState(
        {
          userMessages: [...formattedUserMessages, ...formattedUserMessages],
          numUserMessages: formattedUserMessages.length,
        },
        () => {
          this.initMessageDisplay();
        },
      );
  };

  initMessageDisplay = () => {
    this._isMounted &&
      this.setState(
        {
          startIdx: 0,
        },
        () => {
          this.sendMessage();
        },
      );
  };

  selectNextMessage = () => {
    this._isMounted &&
      this.setState({
        startIdx: (this.state.startIdx + 1) % this.state.numUserMessages,
      });
  };

  sendMessage = () => {
    this.selectNextMessage();

    const minInterval = 4,
      maxInterval = 6;
    // should we use a distribution LMFAO
    let rand = Math.floor(
      Math.random() * (maxInterval - minInterval + 1) + minInterval,
    );
    setTimeout(this.sendMessage, rand * 1000);
  };

  render() {
    const { mobile } = this.props;
    const { startIdx, numMessages, userMessages } = this.state;
    const displayedMessages = userMessages.slice(
      startIdx,
      startIdx + numMessages,
    );

    return (
      <React.Fragment>
        <div ref={this.messagesStart} />
        <div sx={landingChatSx}>
          {displayedMessages.map((m, i) => (
            <ChatMessage key={i} index={i} message={m} mobile={mobile} />
          ))}
          <div ref={this.messagesEnd} />
        </div>
      </React.Fragment>
    );
  }
}

export default firebaseConnect()(LandingChat);
