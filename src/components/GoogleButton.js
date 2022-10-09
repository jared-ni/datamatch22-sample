/** @jsx jsx */

import { jsx, css } from '@emotion/core';

import Google from 'assets/Google.svg';

const googleButtonStyle = css`
  button.google-button,
  button:focus.google-button {
    height: 50px;
    border-width: 0;
    background: white !important;
    color: #737373 !important;
    border-radius: 5px;
    white-space: nowrap;
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05);
    transition-property: background-color, box-shadow;
    transition-duration: 150ms;
    transition-timing-function: ease-in-out;
    padding: 0;

    &:focus,
    &:hover {
      box-shadow: 1px 4px 5px 1px rgba(0, 0, 0, 0.1) !important;
    }

    &:active {
      background-color: #e5e5e5 !important;
      box-shadow: none;
      transition-duration: 10ms;
    }
  }

  .google-button__icon {
    display: inline-block;
    vertical-align: middle;
    margin: 0px 0 8px 8px;
    width: 18px;
    height: 18px;
    box-sizing: border-box;
  }

  .google-button__icon--plus {
    width: 27px;
  }

  .google-button__text {
    display: inline-block;
    vertical-align: middle;
    padding: 0 24px;
    font-size: 14px;
    font-weight: bold;
    font-family: 'Roboto', arial, sans-serif;
  }
`;

// render the google sign in/register button
const GoogleButton = ({ onClick, text }) => {
  return (
    <div css={googleButtonStyle}>
      <button type="button" className="google-button" onClick={onClick}>
        <span className="google-button__icon">
          <img src={Google} alt="Google icon" />
        </span>
        <span className="google-button__text">
          {text || 'Sign in with Google'}
        </span>
      </button>
      <br />
      <br />
    </div>
  );
};

export default GoogleButton;
