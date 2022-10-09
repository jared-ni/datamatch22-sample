/** @jsx jsx */

import { Component } from 'react';
import { jsx, css } from '@emotion/core';
import { Link } from 'react-router-dom';
import { firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { headerHeight } from 'constants/Navbar';

const sidebarStyle = css`
  height: 100%;
  color: #515151;
  position: relative;
  height: 100%;
  overflow-y: scroll;
  padding: ${headerHeight + 30}px 0px 0px 20px;
  padding-bottom: ${headerHeight}px;

  a {
    :hover {
      text-decoration: none;
    }
  }

  .link {
    color: #000;
    font-size: 16px;
    border-radius: 3px;
    padding: 8px 20px;
    line-height: 27px;
    letter-spacing: 0.07em;
    color: #000;
    display: block;
    margin-bottom: 3px;
    margin-right: 20px;
    cursor: pointer;
    text-decoration: none;

    :not(.Highlight):hover {
      background-color: #e7e7e7;
    }
  }

  .Highlight {
    background-color: #f5e3e3;
  }

  .icon {
    width: 26px;
    padding-right: 10px;
    cursor: pointer;
  }

  .Share {
    position: absolute;
    bottom: 10px;
    margin-right: 20px;

    i {
      font-size: 13px;
      width: 100%;
      display: block;
      text-align: center;
    }
  }

  @media (max-height: 600px) {
    .Share {
      position: relative;
      margin-top: 25px;
    }
  }

  .shareIcon {
    width: 30px;
    height: 30px;
    color: #ffffff;
    border-radius: 50%;
    background-color: #ec9697;
    display: inline-flex;
    align-items: center;

    &:hover {
      background-color: #d7525b;
    }
  }

  .shareIconContainer {
    margin: 10px 0px;
    display: flex;
    justify-content: space-between;
  }

  .secondaryLinks {
    margin: 0 auto;
    text-align: center;
    font-size: 0.8em;
  }

  .secondaryLinks a {
    color: #1f1717;
    font-size: 13px;
    :hover {
      color: #d7525b;
    }
  }

  .inviteLink {
    font-weight: 400;
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  }

  .inviteLink > a {
    color: #1f1717;
  }
`;

/* Render link information into actual links */
const renderLink = (link, path) => {
  return (
    <Link
      key={link.text}
      className={'link' + (path === link.to ? ' Highlight' : '')}
      to={link.to}
    >
      <i className={'icon fas fa-' + link.icon}></i>
      {link.text}
    </Link>
  );
};

/* Takes the link data and renders the sidebar */
class Sidebar extends Component {
  /* Render share info at bottom of sidebar */
  renderShare = () => {
    return (
      <div className="Share">
        <div className="shareIconContainer">
          <a
            href="https://www.facebook.com/datamatch.me"
            rel="noopener noreferrer"
            target="_blank"
            style={{ marginLeft: 20 }}
          >
            <div className="shareIcon">
              <i className="fab fa-facebook-f" />
            </div>
          </a>
          <a
            href="https://www.instagram.com/datamatch/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="shareIcon">
              <i className="fab fa-instagram" />
            </div>
          </a>
          <a
            href="https://www.tiktok.com/@datamatch.me"
            rel="noopener noreferrer"
            target="_blank"
            style={{ marginRight: 20 }}
          >
            <div className="shareIcon">
              <i className="fab fa-tiktok" />
            </div>
          </a>
        </div>
        <div className="secondaryLinks">
          <Link to="/app/terms">Terms of Service</Link>&nbsp; • &nbsp;
          <Link to="/app/privacy">Privacy Policy</Link>&nbsp; • &nbsp;
          <Link to="/app/gender">Gender Policy</Link>
        </div>
      </div>
    );
  };

  /* Render bottom links (settings and logout) */
  renderBottomLink = path => {
    const {
      firebase: { logout },
      isApp,
    } = this.props;

    return (
      <div>
        <hr className="solid" style={{ marginRight: 20 }} />
        {/* only render settings if we are in the main app */}
        {isApp &&
          renderLink(
            {
              to: '/app/settings',
              icon: 'cog',
              text: 'Settings',
            },
            path,
          )}
        <div className="link" onClick={logout}>
          {<i className="icon fas fa-sign-out-alt"></i>}
          Log Out
        </div>
      </div>
    );
  };

  render() {
    const {
      isApp,
      links,
      location: { pathname },
      mobile,
    } = this.props;

    const parts = pathname.split('/');
    const path = '/' + parts[1] + (parts[2] ? '/' + parts[2] : '');

    return (
      <div css={sidebarStyle}>
        {links.map(link => {
          return renderLink(link, path);
        })}

        {/* on mobile, render the settings/logout links in the sidebar */}
        {mobile && this.renderBottomLink(path)}

        {/* on desktop and on main application, render the social media share */}
        {!mobile && isApp && this.renderShare()}
      </div>
    );
  }
}

export default compose(firebaseConnect(), withRouter)(Sidebar);
