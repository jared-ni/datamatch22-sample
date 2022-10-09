/** @jsx jsx */

import { jsx, css } from '@emotion/core';
import { Link } from 'react-router-dom';

import logo from 'assets/logo.png';
import logoHeart from 'assets/logo-heart.svg';
import dateOptionLogo from 'assets/dateoptionlogin.png';
import schoolLogo from 'assets/schoolportallogin.png';

const logoStyle = css`
  display: inline-block;
  cursor: pointer;
  padding: 0px;
`;

// grab the source depending on the portal we are in
const getSource = portal => {
  if (portal === '/date_option_portal') {
    return dateOptionLogo;
  } else if (portal === '/school_portal') {
    return schoolLogo;
  }
  return logo;
};

// renders the different logos we have

const Logo = ({ center, flat, landing, mobile, portal, to }) => {
  // flat logo for the navbar header
  if (flat) {
    return (
      <div className="Logo" css={logoStyle}>
        <Link to={to || '/'}>
          <div
            style={{
              display: 'flex',
              justifyContent: center ? 'center' : 'flex-start',
              marginBottom: 0,
            }}
          >
            <img alt="horizontal logo" src={logo} style={{ height: '40px' }} />
          </div>
        </Link>
      </div>
    );
  }

  if (mobile) {
    return (
      <div className="Logo" css={logoStyle}>
        <Link to={to || '/'}>
          <div
            style={{
              display: 'flex',
              justifyContent: center ? 'center' : 'flex-start',
              marginBottom: 0,
            }}
          >
            <img
              alt="horizontal logo"
              src={logoHeart}
              style={{ height: '40px', marginLeft: landing ? '0' : '50%' }}
            />
          </div>
        </Link>
      </div>
    );
  }

  // otherwise simple logo
  return (
    <div className="Logo" css={logoStyle}>
      <Link to={to || '/'}>
        <img
          alt="logo"
          src={getSource(portal)}
          style={{ maxWidth: '300px', width: '100%' }}
        />
      </Link>
    </div>
  );
};
export default Logo;
