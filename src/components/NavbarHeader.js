/** @jsx jsx */

import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { jsx, css } from '@emotion/core';
import { Link, withRouter } from 'react-router-dom';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';

import Input from 'components/Input';
import Logo from 'components/Logo';
import Dropdown from 'components/Dropdown';
import SettingsDropdown from 'components/SettingsDropdown';
import NotifDropdown from 'components/NotifDropdown';

import { headerHeight, sidebarWidth } from 'constants/Navbar';
import { areMatchesLive } from 'utils/status';
import { isInFuture } from 'utils/dates';

const navbarHeaderStyle = css`
  height: ${headerHeight}px;
  align-items: center;
  justify-content: space-between;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 4px;

  .HeaderRight {
    display: flex;
    align-items: center;
    margin-right: 40px;
  }

  .HeaderIcon {
    color: #323232;
    font-size: 24px;
    cursor: pointer;
  }

  .DesktopIcon {
    margin-left: 30px;
  }

  .redDot {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    border-style: solid;
    border-width: 2px;
    text-align: center;
    color: white;
    background-color: red;
    font-size: 14px;
    margin-left: 45px;
    bottom: 35px;
    cursor: pointer;
  }

  .mobileDot {
    margin-left: 30px;
  }

  .notificationsContainer {
    justify-content: center;
    text-align: center;
    display: flex;
  }

  .searchContainer {
    justify-content: center;
    text-align: center;
    display: flex;
    margin: 10px;
  }

  .icons {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100px;
    padding: 10px;
  }

  .HeaderProfile {
    height: ${headerHeight}px;
    padding: 0px 20px;
    display: flex;
    align-items: center;

    &:hover {
      text-decoration: none;
      background-color: #e7e7e7;
    }
  }

  .roundProfilePic {
    object-fit: cover;
    object-position: center;
  }

  .SearchBar {
    height: ${headerHeight / 2}px;
    background-color: white;
    border-radius: 3px;
    width: 25vw;
  }

  .SearchBarMobile {
    height: ${headerHeight / 2}px;
    background-color: white;
    border-radius: 3px;
    width: 90vw;
    max-width: 100%;
  }
`;

class NavbarHeader extends Component {
  state = {
    notifOpen: false,
    settingsOpen: false,
  };

  // toggle the settings dropdown, used in dropdown
  toggleSettingsDropdown = () => {
    this.setState(state => ({ settingsOpen: !state.settingsOpen }));
  };

  // toggle the notifications dropdown
  toggleNotifDropdown = () => {
    this.setState(state => ({ notifOpen: !state.notifOpen }));
  };

  toggleSearchBar = () => {
    this.setState({ searchOpen: !this.state.searchOpen });
  };

  // used by search input
  searchName = e => {
    if (e.key === 'Enter') {
      const query = e.target.value.replace(' ', '+');
      const redirect = query && `/search?name=${query}`;
      this.props.history.push(`/app/messages${redirect}`);
      this.toggleSearchBar();
    }
  };

  render() {
    const {
      matchCatalog,
      isApp,
      isLanding,
      mobile,
      name,
      portal,
      profile_pic,
      profiles,
      sidebarOpen,
      status,
      toggleSidebar,
      uid,
    } = this.props;
    const { settingsOpen, notifOpen, searchOpen } = this.state;

    let notifCount = 0;
    const notifs = this.props.notifs || {};
    const { survey, profile, matches } = notifs;

    // wait for notifs to load, otherwise we flash the wrong number of notifs briefly
    if (isLoaded(this.props.matches, this.props.notifs, profiles)) {
      if (!areMatchesLive(status)) {
        // survey and profile are primary notifications
        if (survey && profile) {
          notifCount = 6 - Object.keys(notifs).length;
        } else {
          notifCount = 2 - !!survey - !!profile;
        }
      } else {
        // count number of non-null profiles
        const matchCount = matches
          ? Object.keys(matches).reduce(
              (acc, match) =>
                (acc +=
                  !matchCatalog[match]?.reported && profiles[match] ? 1 : 0),
              0,
            )
          : 0;
        const unreadCount = matchCatalog
          ? Object.keys(matchCatalog).reduce(
              (acc, match) =>
                (acc +=
                  profiles[match] &&
                  !matchCatalog[match]?.reported &&
                  matchCatalog[match].unread
                    ? 1
                    : 0),
              0,
            )
          : 0;
        const dateCount = this.props.matches
          ? Object.keys(this.props.matches).reduce(
              (acc, match) =>
                (acc +=
                  this.props.matches[match] &&
                  !matchCatalog[match].reported &&
                  this.props.matches[match].dateInfo &&
                  this.props.matches[match].dateInfo.confirmed &&
                  isInFuture(this.props.matches[match].dateInfo.day)
                    ? 1
                    : 0),
              0,
            )
          : 0;
        notifCount = matchCount + unreadCount + dateCount;
      }
    }

    const notifDot = notifCount ? (
      <div
        className={'redDot' + (mobile ? ' mobileDot' : '')}
        style={{ position: 'absolute' }}
        onClick={this.toggleNotifDropdown}
      >
        {notifCount}
      </div>
    ) : null;

    if (!mobile) {
      return (
        // note that the CSS for Navbar is in global.css
        <div className="Navbar" css={navbarHeaderStyle}>
          {/* spacer to align logo right after sidebar */}
          <div style={{ marginLeft: sidebarWidth }}>
            <Logo flat to={`/${portal}`} />
          </div>

          {/* Only render search bar after matches are out */}
          {areMatchesLive(status) && (
            <Input
              className="SearchBar"
              onKeyPress={this.searchName}
              placeholder="Search for someone, shoot your shot!"
            />
          )}

          <div className="HeaderRight">
            {/* only in main application, show the name, profile pic, messages, notif bell */}
            {isApp && (
              <Fragment>
                <Link className="HeaderProfile" to="/app/profile">
                  <img
                    alt="profile pic"
                    className="roundProfilePic"
                    src={profile_pic || require('assets/empty.png').default}
                  />
                  <div style={{ marginLeft: 10, color: '#1F1717' }}>
                    {/* get the first name of the user */}
                    {name.split(' ')[0]}
                  </div>
                </Link>
                <Link to="/app/messages">
                  <i className="HeaderIcon DesktopIcon fas fa-comment-dots" />
                </Link>
                <div
                  style={{ width: '60px' }}
                  className="notificationsContainer"
                >
                  <i
                    onClick={this.toggleNotifDropdown}
                    className="HeaderIcon DesktopIcon fas fa-bell"
                  />
                  {notifDot}
                </div>
              </Fragment>
            )}
            {!isLanding && (
              <i
                onClick={this.toggleSettingsDropdown}
                className="HeaderIcon DesktopIcon fas fa-cog"
              />
            )}
          </div>
          {notifOpen && (
            <Dropdown
              dropdown={() => (
                <NotifDropdown
                  mobile={false}
                  notifs={this.props.notifs}
                  status={status}
                  uid={uid}
                />
              )}
              toggleDropdown={this.toggleNotifDropdown}
            />
          )}
          {settingsOpen && (
            <Dropdown
              dropdown={() => <SettingsDropdown isApp={isApp} />}
              toggleDropdown={this.toggleSettingsDropdown}
            />
          )}
        </div>
      );
    } else {
      return (
        <div className="Navbar" css={navbarHeaderStyle}>
          {/* toggle between hamburger menu button and close button*/}
          {!isLanding ? (
            <div
              onClick={toggleSidebar}
              style={{
                cursor: 'pointer',
              }}
            >
              <i
                className={'fas fa-' + (sidebarOpen ? 'times' : 'bars')}
                style={{
                  color: '#323232',
                  fontSize: sidebarOpen ? 30 : 24, // times icon is too small
                  paddingLeft: 20,
                }}
              />
            </div>
          ) : (
            <div style={{ paddingRight: 20 }}></div>
          )}
          <Logo mobile to={`/${portal}`} landing={isLanding} />
          {/* in the main application, we show the notification bell */}
          {isApp ? (
            <div className="icons">
              {areMatchesLive(status) && (
                <div style={{ width: '60px' }} className="searchContainer">
                  <i
                    onClick={this.toggleSearchBar}
                    className="fas fa-search"
                    style={{ fontSize: '22px' }}
                  />
                </div>
              )}
              <div
                style={{ width: '60px', paddingRight: '20px', margin: '10px' }}
                className="notificationsContainer"
              >
                <i
                  onClick={this.toggleNotifDropdown}
                  className="HeaderIcon fas fa-bell"
                />
                {notifDot}
              </div>
            </div>
          ) : (
            <div style={{ paddingRight: 20 }}></div>
          )}
          {searchOpen && (
            <Dropdown
              dropdown={() => (
                <Input
                  className="SearchBarMobile"
                  onKeyPress={this.searchName}
                  placeholder="Search for someone, shoot your shot!"
                />
              )}
            />
          )}
          {notifOpen && (
            <Dropdown
              dropdown={() => (
                <NotifDropdown
                  mobile={true}
                  notifs={this.props.notifs}
                  status={status}
                  uid={uid}
                />
              )}
              toggleDropdown={this.toggleNotifDropdown}
            />
          )}
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  const {
    auth: { uid },
    data: { matchCatalog, matches, notifs, profiles, status },
    profile: { name, profile_pic },
  } = state.firebase;
  return {
    matchCatalog,
    matches,
    name,
    notifs,
    profile_pic,
    profiles,
    status,
    uid,
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  // notifs will be NULL for school admins/date options admins
  firebaseConnect(({ status, uid }) => {
    return [
      {
        path: `/notifs/${uid}/${areMatchesLive(status) ? 'post' : 'pre'}`,
        storeAs: 'notifs',
      },
    ];
  }),
)(NavbarHeader);
