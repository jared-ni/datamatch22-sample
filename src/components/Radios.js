/** @jsx jsx */

import { Component } from 'react';
import { jsx, css } from '@emotion/core';

// kinda deprecated? we don't use radios

const radiosStyle = css`
  .choice {
    font-size: 16px;
    letter-spacing: 0.05em;
    cursor: pointer;
    margin-right: 7px;
  }

  .round-choice-icon {
    width: 16px;
    height: 16px;
    background: #5abdd1;
    border-radius: 50%;
    border: 2px solid #218da3;
    display: inline-block;
    vertical-align: middle;
    margin-right: 4px;
  }

  .round-choice-icon-checked {
    width: 16px;
    height: 16px;
    background: #5abdd1;
    border-radius: 50%;
    border: 2px solid #218da3;
    display: inline-flex;
    margin-right: 4px;
    color: #08505e;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
  }

  .inner-icon {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #11a5c2;
  }
`;

export default class Radios extends Component {
  render() {
    const { handleClick, name, responses, value } = this.props;

    const labels = this.props.labels || responses;

    return (
      <div css={radiosStyle}>
        {responses.map((response, index) => {
          return (
            <div
              className="choice"
              key={response}
              onClick={() => handleClick(name, response)}
            >
              {value && value === response ? (
                <div className="round-choice-icon-checked">
                  <div className="inner-icon" />
                </div>
              ) : (
                <div className="round-choice-icon"></div>
              )}
              {labels[index]}
            </div>
          );
        })}
      </div>
    );
  }
}
