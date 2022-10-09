/** @jsx jsx */

import { Component } from 'react';
import { jsx, css } from '@emotion/core';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { connect } from 'react-redux';

import Container from 'components/Container';
import Header from 'components/Header';
import Loading from 'components/Loading';

const checkInStyle = css`
  .conf-container {
    margin: 20px auto;
  }

  p {
    margin-bottom: 1em;
  }

  button {
    max-width: 300px;
    margin-right: 1em;
    margin-bottom: 1em;
    padding: 0.1em;
  }

  input {
    max-width: 359px;
    height: 40px;
    border: none;
    background: #f4f2f2;
    display: flex;
    align-items: center;
    letter-spacing: 0.05em;

    color: #545353;
  }
`;

class ConfirmationCodes extends Component {
  render() {
    const { codes, dontFilter, dateOption } = this.props;

    if (!isLoaded(codes) || !isLoaded(dateOption)) {
      return <Loading />;
    }

    const filteredCodes = {};

    const todayDate = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
      }),
    );

    const baseDay = 14;

    const month = todayDate.getMonth() + 1;
    const day = todayDate.getDate();

    for (const code in codes) {
      if (codes[code].day + baseDay === day || dontFilter) {
        filteredCodes[code] = codes[code];
      }
    }

    const displayDate = `${month}/${day}`;

    return (
      <Container>
        <div css={checkInStyle}>
          <Header>
            {dontFilter ? '' : displayDate} {dateOption.name} Confirmation Codes
          </Header>
          <div>
            <b>Confirmation Codes</b>
            <table>
              <tbody>
                {Object.keys(filteredCodes).map(code => (
                  <tr key={code}>
                    <td>{code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {Object.keys(filteredCodes).length === 0 && (
              <div>No codes found for today, {displayDate}!</div>
            )}
          </div>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    codes: state.firebase.data.codes,
    dateOption: state.firebase.data.dateOption,
  };
};

export default compose(
  firebaseConnect(({ dateOptionId }) => [
    {
      path: `/codes/${dateOptionId}`,
      storeAs: 'codes',
    },
    { path: `/dateOptions/${dateOptionId}`, storeAs: 'dateOption' },
  ]),
  connect(mapStateToProps),
)(ConfirmationCodes);
