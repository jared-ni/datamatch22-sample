/** @jsx jsx */

import { jsx, css } from '@emotion/core';

const confirmationBoxStyle = css`
  background: #f4f2f2;
  box-shadow: 0.2em 0.2em #dedef0;
  max-width: 379px;
  height: 102px;
  position: relative;

  p {
    position: absolute;
    top: 50%;
    left: 96px;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .CrossBox {
    position: absolute;
    top: 50%;
    left: 16px;
    margin-top: -32px;
    background: #d49491;
    width: 64px;
    height: 64px;
    border-radius: 10px;
  }

  .cross1,
  .cross2 {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -4px;
    margin-top: -20px;
    height: 40px;
    width: 8px;
    background: #bd574e;
  }

  .TickBox {
    position: absolute;
    top: 50%;
    left: 16px;
    margin-top: -32px;
    background: #c8e6c9;
    width: 64px;
    height: 64px;
    border-radius: 10px;
  }

  .tick1 {
    position: absolute;
    left: 60%;
    top: 50%;
    margin-left: -4px;
    margin-top: -20px;
    height: 40px;
    width: 8px;
    background: #4caf50;
  }

  .tick2 {
    position: absolute;
    left: 30%;
    top: 67%;
    margin-left: -4px;
    margin-top: -10px;
    height: 20px;
    width: 8px;
    background: #4caf50;
  }

  .cross1,
  .tick1 {
    transform: rotate(45deg);
  }
  .cross2,
  .tick2 {
    transform: rotate(-45deg);
  }
`;

const ConfirmationBox = props => {
  if (!props.display) {
    return null;
  }

  if (props.valid) {
    return (
      <div className="ConfirmationBox" css={confirmationBoxStyle}>
        <div className="TickBox">
          <div className="tick1"></div>
          <div className="tick2"></div>
        </div>
        <p>
          You're all set!
          <br />
          {props.message} has been confirmed.
        </p>
      </div>
    );
  } else {
    return (
      <div className="ConfirmationBox" css={confirmationBoxStyle}>
        <div className="CrossBox">
          <div className="cross1"></div>
          <div className="cross2"></div>
        </div>
        <p>{props.message}</p>
      </div>
    );
  }
};

export default ConfirmationBox;
