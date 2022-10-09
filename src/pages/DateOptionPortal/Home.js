/** @jsx jsx */

import { Component } from 'react';
import { jsx, css } from '@emotion/core';
import { withRouter } from 'react-router-dom';
import { Button } from 'theme-ui';

import Container from 'components/Container';
import Header from 'components/Header';

const checkInStyle = css`
  p {
    margin-bottom: 1em;
  }
`;

class Home extends Component {
  renderDateSchedule() {
    const { days = [] } = this.props.dateOptionInformation;

    return (
      <div>
        <b>Date schedule:</b>
        <table>
          <tbody>
            <tr>
              <th>
                <b>Date</b>
              </th>
              <th>
                <b>Claimed</b>
              </th>
              <th>
                <b>Allotted</b>
              </th>
            </tr>
            {days.map((date, index) => {
              const month = 2;
              const day = 14 + parseInt(index);
              const dateString = new Date(
                `${month}/${day}/2022`,
              ).toDateString();
              const dayOfWeek = dateString.split(' ')[0];
              const { datesAllotted = 0, datesAvailable = 0 } = date;

              return (
                <tr key={index}>
                  <td>{`${month}/${day} (${dayOfWeek})`}</td>
                  <td>{datesAllotted - datesAvailable}</td>
                  <td>{datesAllotted}</td>
                </tr>
              );
            })}
            <tr>
              <td>
                <b>Total</b>
              </td>
              <td>
                <b>
                  {Object.values(days).reduce(
                    (total, { datesAllotted, datesAvailable }) =>
                      total + datesAllotted - datesAvailable,
                    0,
                  )}
                </b>
              </td>
              <td>
                <b>
                  {Object.values(days).reduce(
                    (total, { datesAllotted }) => total + datesAllotted,
                    0,
                  )}
                </b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderButtons() {
    return (
      <div style={{ marginBottom: '1em' }}>
        <Button
          onClick={() =>
            this.props.history.push('/date_option_portal/check-in')
          }
          style={{ marginRight: '10px' }}
        >
          Check-in online
        </Button>
        <Button
          onClick={() =>
            this.props.history.push('/date_option_portal/confirmation-codes')
          }
        >
          Print today's codes
        </Button>
      </div>
    );
  }

  renderInfo() {
    const { description } = this.props.dateOptionInformation;

    return (
      <div>
        <p>
          <b>Date description: </b>
          {description || 'Placeholder description.'}
        </p>
        {this.renderDateSchedule()}
      </div>
    );
  }

  render() {
    return (
      <Container>
        <div css={checkInStyle}>
          <Header>Date Option Portal</Header>
          <p>
            <b>Welcome to the date option portal!</b>
            <br />
            You can print confirmation codes below, or see the agreement you
            negotiated with the Datamatch team in more detail.
            <br />
            Contact us at{' '}
            <a href="mailto:cupids@datamatch.me">cupids@datamatch.me</a> if
            you’d like to make changes.
          </p>
          {this.renderButtons()}
          {this.renderInfo()}
        </div>
      </Container>
    );
  }
}

export default withRouter(Home);
