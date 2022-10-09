/** @jsx jsx */

import { Component } from 'react';
import { jsx, css } from '@emotion/core';
import { Button } from 'theme-ui';

import Container from 'components/Container';
import Header from 'components/Header';
import Input from 'components/Input';
import ConfirmationBox from './components/ConfirmationBox';

const checkInStyle = css`
  .conf-container {
    margin: 20px auto;
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

export default class CheckIn extends Component {
  state = {
    code: '',
    display: false,
    message: '',
    valid: false,
  };

  handleInputChange = event => {
    const code = event.target.value;

    this.setState({
      code,
      display: false,
      message: '',
      valid: false,
    });
  };

  onClick = async e => {
    e.preventDefault();
    const { code } = this.state;
    const { firebase, dateOptionId } = this.props;

    // Feb 14 is the first day matches can go on dates
    const baseMonth = 2;
    const baseDay = 14;

    if (code === '') {
      this.setState({
        valid: false,
        display: true,
        message: 'Please enter a confirmation code.',
      });
      return;
    }

    const todayDate = new Date(
      new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
      }),
    );

    const codeSnapshot = await firebase
      .ref('codes')
      .child(dateOptionId)
      .child(code)
      .once('value');

    const codeObj = codeSnapshot.val();

    // If invalid code, display error
    if (!codeObj) {
      this.setState({
        code: '',
        valid: false,
        display: true,
        message: code + ' is an invalid code.',
      });
      return;
    }

    const { claimed, day } = codeObj;

    // If already claimed, display error
    if (claimed) {
      this.setState({
        code: '',
        valid: false,
        display: true,
        message: `${code} has been checked-in already.`,
      });
      return;
    }

    // If wrong day, display error
    if (
      todayDate.getMonth() + 1 !== baseMonth ||
      todayDate.getDate() !== baseDay + day
    ) {
      this.setState({
        code: '',
        valid: false,
        display: true,
        message: `Wrong day! ${code} is a valid code on 2/${baseDay + day}.`,
      });
      return;
    }

    // All good, claim the code
    await firebase
      .ref(`/codes/${dateOptionId}/${code}`)
      .update({ claimed: true });
    this.setState({
      code: '',
      valid: true,
      display: true,
      message: code,
    });
  };

  render() {
    return (
      <Container>
        <div className="CheckIn" css={checkInStyle}>
          <Header>Check-in</Header>
          <b>
            Please do not check a date in unless both people are physically
            present!
          </b>

          <form onSubmit={this.onClick}>
            <div className="conf-container">
              <Input
                handleInputChange={this.handleInputChange}
                name="code"
                placeholder="ABC123"
                text="Type in confirmation code:"
                type="text"
                value={this.state.code}
              />

              <br />

              <Button>Verify</Button>
            </div>
          </form>

          <ConfirmationBox {...this.state} />

          <br />
        </div>
      </Container>
    );
  }
}
