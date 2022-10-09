/** @jsx jsx */

import { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { jsx, css } from '@emotion/core';
import { Link } from 'react-router-dom';

import { footerHeight } from 'constants/Navbar';

const navbarFooterStyle = css`
  bottom: 0;
  height: ${footerHeight}px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px -2px 4px;

  a {
    color: #1f1717;
  }

  .FooterLink {
    text-align: center;
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;

    &:hover {
      text-decoration: none;
      background-color: #e7e7e7;
    }
  }

  .MobileIcon {
    color: #323232;
    font-size: 24px;
    min-height: 40px;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
`;

class NavbarFooter extends Component {
  render() {
    return (
      <div className="Navbar" css={navbarFooterStyle}>
        <Link className="FooterLink" to="/app/survey">
          <div>
            <i className="MobileIcon fas fa-th-list" />
            <div>Survey</div>
          </div>
        </Link>
        <Link className="FooterLink" to="/app/results">
          <div>
            <i className="MobileIcon fas fa-heart" />
            <div>Matches</div>
          </div>
        </Link>
        <Link className="FooterLink" to="/app/messages">
          <div>
            <i className="MobileIcon fas fa-comment-dots" />
            <div>Messages</div>
          </div>
        </Link>
        <Link className="FooterLink" to="/app/profile">
          <div>
            <img
              alt="profile pic"
              className="roundProfilePic"
              src={
                this.props.profile_pic || require('assets/empty.png').default
              }
            />
            <div>Profile</div>
          </div>
        </Link>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { profile_pic: state.firebase.profile.profile_pic };
};

export default compose(connect(mapStateToProps))(NavbarFooter);
