/** @jsx jsx */

import { Component } from 'react';
import { jsx } from 'theme-ui';
import moment from 'moment';

import { Mixpanel } from 'utils/mixpanel.js';
import launch from 'constants/Launch';
import PageFAQ from 'pages/PageFAQ/PageFAQ';
import Email from 'components/Email';

import { pageLandingSx, MoveUpDown } from './PageLandingStyles.js';

// pads a number to 2 digits by prepending zeros
const addLeadingZeros = value => {
  value = String(value);
  while (value.length < 2) {
    value = '0' + value;
  }
  return value;
};

export default class PageLanding extends Component {
  // initialize countdown
  state = this.calculateCountdown();

  componentDidMount() {
    // Web analytics
    Mixpanel.track('Landing_Page', {});

    // every second update the countdown
    this.interval = setInterval(() => {
      this.setState(this.calculateCountdown());
    }, 1000);
  }

  componentWillUnmount() {
    // cleanup set interval
    clearInterval(this.interval);
  }

  calculateCountdown() {
    // use moment to calculate countdown :)
    const countdown = moment.duration(launch.diff(moment()));

    return {
      months: countdown.months(),
      days: countdown.days(),
      hours: countdown.hours(),
      minutes: countdown.minutes(),
      seconds: countdown.seconds(),
    };
  }

  render() {
    const { months, days, hours, minutes, seconds } = this.state;

    return (
      <div className="page-landing" sx={pageLandingSx}>
        <div className="screen -first">
          <img
            alt="logo"
            className="dm-logo"
            src={require('assets/dmlogo.png').default}
          />
          <div className="dm-text">DATAMATCH</div>
          <div className="countdown">
            <div className="item">
              <div className="number">{addLeadingZeros(months)}</div>
              <div className="text">{months === 1 ? 'MONTH' : 'MONTHS'}</div>
            </div>
            <div className="item">
              <div className="number">{addLeadingZeros(days)}</div>
              <div className="text">{days === 1 ? 'DAY' : 'DAYS'}</div>
            </div>
            <div className="item">
              <div className="number">{addLeadingZeros(hours)}</div>
              <div className="text">{hours === 1 ? 'HOUR' : 'HOURS'}</div>
            </div>
            <div className="item">
              <div className="number">{addLeadingZeros(minutes)}</div>
              <div className="text">{minutes === 1 ? 'MIN' : 'MINS'}</div>
            </div>
            <div className="item">
              <div className="number">{addLeadingZeros(seconds)}</div>
              <div className="text">{seconds === 1 ? 'SEC' : 'SECS'}</div>
            </div>
          </div>
          <Email />
          <div style={{ position: 'absolute', bottom: 20, paddingRight: 20 }}>
            <i
              className="fas fa-chevron-down"
              style={{ fontSize: 30, position: 'absolute', bottom: 0 }}
              sx={{ animation: `${MoveUpDown} 2s ease-in-out infinite` }}
            ></i>
          </div>
        </div>
        <div className="screen -stats">
          <h1 style={{ fontSize: 40 }}>2022 in summary</h1>
          <h1>40 colleges</h1>
          <h1>50,000+ users</h1>
          <h1>196,000+ virtual matches</h1>
          <br />
          <h1 style={{ textAlign: 'center' }}>
            with more to
            <br />
            come in 2023 ;)
          </h1>
        </div>
        <div className="screen -faq">
          <div className="faq">
            <PageFAQ landing={true} />
          </div>
        </div>
        {/* <div className="screen -team">
          <img alt="team" src={require('assets/team.jpg').default} />
        </div> */}
      </div>
    );
  }
}
