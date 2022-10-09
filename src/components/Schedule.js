/** @jsx jsx */

import { Component } from 'react';
import { jsx, css } from '@emotion/core';
import { Button } from 'theme-ui';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { updateProfiles } from 'utils/updateProfiles';
import { dateTimes, daysOfWeek } from 'constants/DateTimes';

const scheduleStyle = css`
  .schedule {
    background-color: white;
    display: grid;
    grid-template-rows: 50px 35px 30px 20px 170px;
    align-items: start;
    border: 2px solid #524f6c;
    border-radius: 3px;
    padding-left: 30px;
    padding-top: 40px;
    padding-bottom: 40px;
    padding-right: 30px;
    box-shadow: 7px 7px #f5e3e3;
    overflow: auto;
  }

  .select {
    width: 250px;
    height: 36px;
    border: 1px solid #b1b1b1;
    box-sizing: border-box;
    border-radius: 3px;
    font-size: 14px;
    line-height: 17px;
    background-image: url('${window.location.origin}/angle-down.png');
    background-position: 95% 50%;
    background-repeat: no-repeat;
    background-size: 16px;
    padding: 3px 0 3px 6px;
  }

  .big-text {
    font-weight: bold;
    font-size: 20px;
    line-height: 29px;
    display: flex;
    align-items: center;
    color: #1f1717;
  }

  .line3 {
    font-size: 12px;
    line-height: 12px;
    display: flex;
    align-items: center;
    color: #000000;
  }

  .daysOfWeek {
    font-weight: bold;
    font-size: 16px;
    line-height: 146%;
    display: flex;
    align-items: center;
    text-align: center;
    color: #1f1717;
  }

  .datesOfWeek {
    font-size: 12px;
    line-height: 146%;
    display: flex;
    align-items: center;
    text-align: center;
    color: #524f6c;
  }

  .timesGridText {
    font-size: 14px;
    display: grid;
    justify-items: center;
    align-items: center;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(1, 30px);
  }

  .timesGrid {
    display: grid;
    justify-items: center;
    align-items: center;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(3, 50px);
    grid-auto-flow: column;
  }

  .backgroundWhite {
    background-color: #ffffff;
  }

  .backgroundGray {
    background-color: #e7e7e7;
  }

  .backgroundPink {
    background-color: #f5e3e3;
  }

  .button {
    width: 100%;
    padding: 10%;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
  }

  .saveButton {
    color: red;
    padding: 10px 0px;
  }

  .saveMessage {
    line-height: 30px;
  }

  @media (max-width: 925px) {
    .schedule {
      padding-left: 20px;
      padding-top: 25px;
      padding-bottom: 25px;
      padding-right: 20px;
      /* grid-template-rows: 4.5vw 4.5vw 3vw 2vw 3vw; */
      /* height: 300px; */
    }

    .button {
      font-size: 75%;
    }

    /* .big-text {
      font-size: 3vw;
    } */

    /* .daysOfWeek {
      font-size: 2vw;
    }

    .datesOfWeek {
      font-size: 1.5vw;
    } */

    /* .line3 {
      line-height: 12px;
    }

    .timesGridText {
      font-size: 1.5vw;
    }

    .save-button-text {
      font-size: 2vw;
    } */

    .select {
      width: 115%;
      height: 25px;
      font-size: 2vw;
      background-position: 94% 50%;
      background-size: 13px;
    }

    /* .saveMessage {
      line-height: 25px;
      font-size: 1.75vw;
    } */
  }

  @media (max-width: 600px) {
    .schedule {
      padding: 20px;
      padding-top: 30px;
      grid-column-gap: 20px;
      /* grid-template-rows: 15% 10% 10% 10% 35%;
      height: 43vw; */
    }

    .select {
      height: 20px;
      font-size: 2vw;
      padding: 1px 0 1px 6px;
      background-position: 94% 55%;
      background-size: 10px;
    }

    .timesGridText,
    .timesGrid {
      grid-template-columns: repeat(7, 80px);
    }

    /* .line3 {
      font-size: 1.25vw;
    }

    .timesGridText {
      font-size: 1.25vw;
      grid-template-rows: repeat(1, 10px);
    }

    .timesGrid {
      grid-template-rows: repeat(3, 4vw);
    } */

    /* .daysOfWeek {
      font-size: 1.75vw;
    }

    .datesOfWeek {
      font-size: 1.75vw;
    } */

    /* .button {
      padding: 2px;
      font-size: 1.75vw;
    }

    .save-button-size {
      padding: 5px;
    }

    .saveMessage {
      line-height: 20px;
      font-size: 1.75vw;
    } */
  }
`;

const initalizeDateTimes = () =>
  dateTimes.reduce((map, dateTime) => ({ ...map, [dateTime]: 0 }), {});

// takes the array from Firebase and transforms it into the correct map and default timezone
const transformFirebaseDateTimes = times => ({
  times:
    !times || times.length < dateTimes.length
      ? initalizeDateTimes() // set default times if "times" node is missing from data
      : times.split('').reduce(
          (map, dateValue, index) => ({
            ...map,
            [dateTimes[index]]: parseInt(dateValue),
          }),
          {},
        ), // otherwise map values from times array to times Object
});

class Schedule extends Component {
  constructor(props) {
    super(props);
    const { times } = props.publicProfile;
    this.state = {
      ...transformFirebaseDateTimes(times),
      saveMessage: '',
    };
  }

  componentDidUpdate(prevProps) {
    const { times } = this.props.publicProfile;
    if (times !== prevProps.publicProfile.times) {
      this.setState(transformFirebaseDateTimes(times));
    }
  }

  // takes in index of where the time is stored in the map of all times
  // and updates its corresponding color state
  updateCounter = dateTime => {
    this.setState(({ times }) => ({
      times: { ...times, [dateTime]: (times[dateTime] + 1) % 3 },
      saveMessage: 'You have unsaved changes!',
    }));
  };

  // component only writes to data through saving
  saveButton = () => {
    this.props.updateAllProfiles({
      times: this.getValues(this.state.times, dateTimes).join(''),
    });
    this.setState({ saveMessage: 'Saved!' });
  };

  // resets times in state to default values
  resetButton = () => {
    this.setState({
      times: initalizeDateTimes(),
      saveMessage: 'You have unsaved changes!',
    });
  };

  // Rewrote Object.values() because it does some weird stuff on Safari
  getValues = (object, keys) => {
    return keys.map(key => object[key]);
  };

  render() {
    const { times } = this.state;

    // maps Date/Time in state to div button with time automatially rendered in the proper timezone using .toLocaleTimeString()
    // reference to .toLocaleTimeString(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
    // class name controls color of button with rendering conditional on state (0,1,2)

    const timeButtons = dateTimes.map(dateTime => {
      return (
        <div
          className={
            times[dateTime] === 0
              ? 'button backgroundWhite'
              : times[dateTime] === 1
              ? 'button backgroundPink'
              : 'button backgroundGray'
          }
          key={dateTime}
          onClick={() => this.updateCounter(dateTime)}
        >
          {dateTime.getUTCHours() === 16
            ? 'morning'
            : dateTime.getUTCHours() === 22
            ? 'evening'
            : 'afternoon'}
        </div>
      );
    });

    // Output: Sunday | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday
    // days can be changed in the constants file DatesTimes.js
    const daysOfWeekText = daysOfWeek.map(day => (
      <div className="daysOfWeek" key={day}>
        {day}
      </div>
    ));

    // Output: Feb 14 | Feb 15 | Feb 16 | Feb 17 | Feb 18 | Feb 19 | Feb 20
    // dates can be changed by updating the month and startingDay (currently set to the Feb 14th)
    const month = 'Feb ';
    const startingDay = 14;
    const datesOfWeekText = daysOfWeek.map((_, index) => (
      <div className="datesOfWeek" key={index}>
        {month.concat(index + startingDay)}
      </div>
    ));

    return (
      <div css={scheduleStyle}>
        <br />
        <div className="schedule">
          <div className="big-text">
            I'd love to hang out or get coffee on...
          </div>
          <div className="line3">
            Single-click for "strongly preferred", double-click for "somewhat
            preferred."
          </div>
          <div className="timesGridText">{daysOfWeekText}</div>
          <div className="timesGridText">{datesOfWeekText}</div>
          <div className="timesGrid">{timeButtons}</div>
          <div className="saveMessage">{this.state.saveMessage}</div>
          <span className="save-button-text">
            <Button
              onClick={this.saveButton}
              style={{ marginRight: '10px' }}
              className="save-button-size"
            >
              Save changes!
            </Button>
            <Button onClick={this.resetButton} className="save-button-size">
              Reset all times
            </Button>
          </span>
        </div>
        <hr />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { email, uid } = state.firebase.auth;
  return {
    publicProfile: state.firebase.data.publicProfile,
    updateAllProfiles: updateProfiles(props.firebase.update, uid, email),
  };
};

export default compose(firebaseConnect(), connect(mapStateToProps))(Schedule);
