/** @jsx jsx */

import { Component } from 'react';
import { jsx, css } from '@emotion/core';
import { firebaseConnect } from 'react-redux-firebase';
import Textarea from 'components/Textarea';

const style = css`
  margin-top: 2em;
  background-color: #f3f2f2;
  padding: 2em;

  .narrative-input {
    background-color: #fff;
    border: 1px solid #fff;
    border-radius: 5px;
  }
  .submit-button {
    background: #545353;
    color: #ffffff;
    font-size: 18px;
    height: 38px;
    letter-spacing: 0.05em;
    margin-top: 20px;
    width: 120px;
  }
`;

// used in Meet24 to get narratives on freshmen first year stories

class Hindsight extends Component {
  state = { memory: '', challenge: '', submitted: false };

  onFormSubmit = async e => {
    e.preventDefault();
    const { memory, challenge } = this.state;
    const narrative = { memory, challenge };
    await this.props.firebase.push('narratives').set(narrative);
    this.setState({ submitted: true });
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div css={style}>
        <div>
          <h3 style={{ fontSize: '1.2em', color: '#458CA1' }}>
            Have any thoughts about being a first-year? Want to be featured
            (anonymously) in the Harvard Art Museums?
          </h3>
        </div>
        {!this.state.submitted ? (
          <div>
            <div style={{ marginTop: '1em' }}>
              <a
                href="https://metalabharvard.github.io/"
                rel="noopener noreferrer"
                target="_blank"
              >
                metaLAB(at)Harvard
              </a>{' '}
              is collaborating with Datamatch to gather your stories about being
              a first-year during these ~uncertain times~! Responses will be
              kept totally anonymous and not associated with your profile, but
              may be displayed at an exhibit in the Art Museums. Vent to us!
            </div>
            <div style={{ marginTop: '1em' }}>
              <Textarea
                className="narrative-input"
                handleInputChange={this.onInputChange}
                placeholder="Tell us about your favorite memory so far this fall... "
                name="memory"
                rows={3}
              />
              <Textarea
                className="narrative-input"
                handleInputChange={this.onInputChange}
                placeholder="Tell us about a challenge you’ve faced..."
                name="challenge"
                rows={3}
              />
              <button className="submit-button" onClick={this.onFormSubmit}>
                <i className="fas fa-check checkmark"></i>Submit
              </button>
            </div>
          </div>
        ) : (
          <div>Thank you for sharing!!</div>
        )}
      </div>
    );
  }
}

export default firebaseConnect()(Hindsight);
