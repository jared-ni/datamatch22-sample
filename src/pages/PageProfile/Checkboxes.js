/** @jsx jsx */

import React, { Component } from 'react';
import { jsx, css } from '@emotion/core';

// kinda deprecated? we don't use checkboxes

const checkboxesStyle = css`
  .choice {
    cursor: pointer;
    margin-right: 7px;
  }

  .choice-icon {
    width: 16px;
    height: 16px;
    background: white;
    border: 2px solid #323232;
    display: inline-block;
    vertical-align: middle;
    margin-right: 4px;
  }

  .choice-icon-checked {
    width: 16px;
    height: 16px;
    background: white;
    border: 2px solid #323232;
    display: inline-block;
    font-size: 10px;
    color: #323232;
    line-height: 13px;
    vertical-align: middle;
    text-align: center;
    margin-right: 4px;

    i {
      margin-left: 1px;
    }
  }
`;

export default class Checkboxes extends Component {
  render() {
    const {
      crossMatchSchools,
      handleClick,
      name,
      responses,
      values,
      disabled,
    } = this.props;

    const labels = this.props.labels || responses;

    return (
      <div css={checkboxesStyle}>
        {responses.map((response, index) => {
          return (
            <div
              className="choice"
              key={response}
              style={{ color: disabled ? '#B1B1B1' : '#323232' }}
              onClick={() => !disabled && handleClick(name, response)}
            >
              {values && values[response] ? (
                <div
                  className="choice-icon-checked"
                  style={{
                    color: disabled ? '#B1B1B1' : '#323232',
                    borderColor: disabled ? '#B1B1B1' : '#323232',
                  }}
                >
                  <i className="fas fa-check" />
                </div>
              ) : (
                <div
                  className="choice-icon"
                  style={{
                    borderColor: disabled ? '#B1B1B1' : '#323232',
                  }}
                ></div>
              )}
              {labels[index].includes('opt in') ? (
                <React.Fragment>
                  I want to <b>opt in</b> to being matched with{' '}
                  {crossMatchSchools} students!
                </React.Fragment>
              ) : (
                labels[index]
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
