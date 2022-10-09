/** @jsx jsx */

import { Fragment } from 'react';
import { jsx, css } from '@emotion/core';
import { Link } from 'react-router-dom';
import { firebaseConnect } from 'react-redux-firebase';

const settingsDropdownStyle = css`
  width: 138px;

  .dropdownItem {
    display: block;
    padding: 10px 0px 10px 15px;
    width: 100%;
    background-color: #ffffff;
    text-align: left;
    cursor: pointer;

    &:hover {
      text-decoration: none;
      background-color: #e7e7e7;
    }
  }
`;

// dropdown for settings/logout in navheader
const SettingsDropdown = ({ isApp, firebase }) => {
  return (
    <div css={settingsDropdownStyle}>
      {isApp && (
        <Fragment>
          <Link className="dropdownItem" to="/app/settings">
            Settings
          </Link>
          <hr className="solid line" />
        </Fragment>
      )}
      <Link className="dropdownItem" to="/app/feedback">
        Send feedback
      </Link>
      <hr className="solid line" />
      <div className="dropdownItem" onClick={firebase.logout}>
        Logout
      </div>
    </div>
  );
};

export default firebaseConnect()(SettingsDropdown);
