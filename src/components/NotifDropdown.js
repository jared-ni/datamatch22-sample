/** @jsx jsx */

import { Component } from 'react';
import { jsx, css } from '@emotion/core';
import { Link } from 'react-router-dom';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Loading from 'components/Loading';
import { areMatchesLive } from 'utils/status';
import { isInFuture } from 'utils/dates';

const notifDropdownStyle = css`
  padding-bottom: 20px;
  position: relative;
  max-height: 440px;
  overflow-y: auto;

  .titleItem {
    display: block;
    padding: 20px 0px 0px 15px;
    width: 100%;
    background-color: #ffffff;
    text-align: left;
    cursor: pointer;
    font-weight: bold;
    font-size: 20px;
  }

  .block {
    display: block;
  }

  .flex {
    display: flex;
  }

  .dropdownItem {
    display: flex;
    padding: 20px 20px 20px 20px;
    align-items: center;
    background-color: #ffffff;
    text-align: left;
    cursor: pointer;
    &:hover {
      text-decoration: none;
      background-color: #e7e7e7;
    }
  }

  .dropdownItemNoHover {
    display: flex;
    padding: 20px 20px 20px 20px;
    align-items: center;
    background-color: #ffffff;
    text-align: left;
    cursor: pointer;
  }

  .roundPic {
    display: flex;
    height: 50px;
    width: 50px;
    flex: 0 0 50px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border-style: solid;
    border-width: 2px;
    font-size: 20px;
  }

  .icon {
    color: white;
  }

  .boxRed {
    border-color: #ec9697;
    background-color: #fff8f8;
  }

  .boxRedIcon {
    border-color: #d9565d;
    background-color: #d9565d;
  }

  .boxBlue {
    border-color: #524f6c;
    background-color: rgba(222, 222, 240, 0.2);
  }

  .boxBlueIcon {
    border-color: #524f6c;
    background-color: #524f6c;
  }

  .boxGreen {
    border-color: #a9d8be;
    background-color: #f4faf7;
  }

  .boxGreenIcon {
    border-color: #a9d8be;
    background-color: #a9d8be;
  }

  .textRed {
    color: #d7525b;
  }

  .textBlue {
    color: #524f6c;
  }

  .notifBoxBefore {
    padding: 20px;
    width: 100%;
    border-radius: 2.5%;
    border-style: solid;
    border-width: 2px;
    margin-left: 20px;
  }

  .textLeft {
    width: 100%;
    font-size: 13px;
    text-align: left;
  }

  .textRight {
    width: 50%;
    font-size: 11px;
    text-align: right;
    font-style: italic;
    text-decoration: underline;
    margin-top: 2px;
  }

  .textCenter {
    width: 100%;
    font-size: 13px;
    text-align: center;
  }
`;

const notifMessagesPre = {
  survey: {
    mainText: 'Questions for love, friendship, and everything in between',
    linkText: 'fill out survey now',
    link: '/app/survey',
    icon: 'fas fa-th-list',
  },
  profile: {
    mainText: 'Who are you doe?',
    linkText: 'fill out profile',
    link: '/app/profile',
    icon: 'fas fa-user',
  },
  bio: {
    mainText: 'Seriously. Who are you doe?',
    linkText: 'add bio',
    link: '/app/profile',
    icon: 'fas fa-user',
  },
  matchPrefs: {
    mainText: 'Want sum jokes or a soulmate?',
    linkText: 'fill out preferences',
    link: '/app/results',
    icon: 'fas fa-heart',
  },
  spotify: {
    mainText: "We know you {do/don't} like bts",
    linkText: 'sync spotify',
    link: '/app/profile',
    icon: 'fab fa-spotify',
  },
  crush: {
    mainText: 'Got a crush? Shoot your shot!',
    linkText: 'play crush roulette',
    link: '/app/roulette',
    icon: 'fas fa-users',
  },
};

// dropdown for notifications in navheader
class NotifDropdown extends Component {
  displayNotif = (icon, key, link, linkText, mainText, onClick, isRed) => {
    let classBox = 'notifBoxBefore';
    let classTextRight = 'textRight';
    let classPic = 'roundPic';

    if (isRed) {
      classBox += ' boxRed flex';
      classTextRight += ' textRed';
      classPic += ' boxRedIcon';
    } else {
      classBox += ' boxBlue flex';
      classTextRight += ' textBlue';
      classPic += ' boxBlueIcon';
    }

    return (
      <Link className="dropdownItem" to={link} key={key} onClick={onClick}>
        <div className={classPic}>{icon}</div>
        <div className={classBox}>
          <div className="textLeft">{mainText}</div>
          <div className={classTextRight}>{linkText}</div>
        </div>
      </Link>
    );
  };

  displayNotifPre = notifKey => {
    const icon = (
      <i className={'icon ' + notifMessagesPre[notifKey]['icon']}></i>
    );
    const link = notifMessagesPre[notifKey]['link'];
    const linkText = notifMessagesPre[notifKey]['linkText'];
    const mainText = notifMessagesPre[notifKey]['mainText'];
    let onClick = null;
    if (notifKey !== 'survey' && notifKey !== 'profile') {
      onClick = () => this.deleteNotif(notifKey);
    }

    return this.displayNotif(
      icon,
      notifKey,
      link,
      linkText,
      mainText,
      onClick,
      true,
    );
  };

  displayRoundPic = pic => {
    return (
      <img
        alt="profile pic"
        className="roundProfilePic"
        src={pic || require('assets/empty.png').default}
      />
    );
  };

  displayMatchNotif = (matchUid, name, pic, index) => {
    const icon = this.displayRoundPic(pic);
    const key = 'match' + index;
    const link = `/app/messages/${matchUid}`;
    const linkText = 'say hello';
    const mainText = (
      <div>
        You matched with <b>{name}</b>! 👀
      </div>
    );
    const onClick = () => this.deleteMatchNotif(matchUid);
    return this.displayNotif(
      icon,
      key,
      link,
      linkText,
      mainText,
      onClick,
      true,
    );
  };

  displayUnreadNotif = (matchUid, name, pic, index, unread) => {
    const icon = this.displayRoundPic(pic);
    const key = 'unread' + index;
    const link = `/app/messages/${matchUid}`;
    const linkText = 'view messages';
    const mainText = (
      <div>
        You have{' '}
        <b>
          {unread} unread message{unread > 1 ? 's' : ''}
        </b>{' '}
        from <b>{name}</b>
      </div>
    );
    return this.displayNotif(icon, key, link, linkText, mainText, null, false);
  };

  displayDateNotif = (dateInfo, matchUid, name, pic, index) => {
    const icon = this.displayRoundPic(pic);
    const key = 'date' + index;
    const link = `/app/messages/${matchUid}`;
    const linkText = 'view details';
    const mainText = (
      <div>
        <div>
          <b>It's a date with {name}!</b>
        </div>
        For Feb {dateInfo.day + 14} at {dateInfo.time}. Don't be late!
      </div>
    );
    return this.displayNotif(icon, key, link, linkText, mainText, null, false);
  };

  deleteNotif = async notifKey => {
    await this.props.updateNotifsPre({ [notifKey]: true });
  };

  deleteMatchNotif = async matchUid => {
    const updates = {};
    updates[`/matches/${matchUid}`] = null;
    await this.props.updateNotifsPost(updates);
  };

  renderLoading = () => {
    return (
      <div style={{ margin: '10% auto', width: 175, size: 200 }}>
        <Loading color="pink" size={50} type="spin" />
      </div>
    );
  };

  render() {
    const { catalog, mobile, profiles, status } = this.props;

    // wait for notifications to load
    if (!isLoaded(this.props.notifs)) {
      return this.renderLoading();
    }

    const notifications = this.props.notifs || {};

    // once notifications load, if matches are out, then also wait for all profiles
    // in the notifications to load
    const allProfilesLoaded = Object.keys(
      notifications.matches || {},
    ).every(uid => isLoaded(profiles[uid]));

    if (this.props.notifs && areMatchesLive(status) && !allProfilesLoaded) {
      return this.renderLoading();
    }

    const {
      bio,
      profile,
      survey,
      spotify,
      crush,
      matchPrefs,
      matches,
    } = notifications;

    let notifDisplay = null;
    // Pre-match notifications
    if (!areMatchesLive(status)) {
      const notifKeys = Object.keys(notifMessagesPre);
      const notifs = Object.assign(...notifKeys.map(key => ({ [key]: true }))); // no notifications

      // primary notifications
      if (!survey) {
        notifs['survey'] = false;
      }
      if (!profile) {
        notifs['profile'] = false;
      }

      // only show bio, spotify, crush, & matchPrefs after survey/profile done
      const notifsPrimary = survey && profile;

      if (!bio && notifsPrimary) {
        notifs['bio'] = false;
      }

      if (!spotify && notifsPrimary) {
        notifs['spotify'] = false;
      }

      if (!crush && notifsPrimary) {
        notifs['crush'] = false;
      }

      if (!matchPrefs && notifsPrimary) {
        notifs['matchPrefs'] = false;
      }

      notifDisplay = notifKeys.map(notif => {
        if (!notifs[notif]) {
          return this.displayNotifPre(notif);
        }
        return null;
      });
    }
    // Post-match notifications
    else {
      const matchNotifs =
        matches &&
        catalog &&
        Object.keys(matches).map((matchUid, index) => {
          if (!profiles[matchUid] || catalog[matchUid].reported) {
            return null;
          }
          const name = profiles[matchUid] && profiles[matchUid].name;
          const pic = profiles[matchUid] && profiles[matchUid].profile_pic;
          return this.displayMatchNotif(matchUid, name, pic, index);
        });

      const unreadNotifs =
        catalog &&
        Object.keys(catalog).map((matchUid, index) => {
          const unread =
            catalog[matchUid] &&
            !catalog[matchUid].reported &&
            catalog[matchUid].unread;

          if (!unread) {
            return null;
          }

          const name = profiles[matchUid] && profiles[matchUid].name;
          const pic = profiles[matchUid] && profiles[matchUid].profile_pic;
          return this.displayUnreadNotif(matchUid, name, pic, index, unread);
        });

      const dateNotifs =
        this.props.matches &&
        catalog &&
        Object.keys(this.props.matches).map((matchUid, index) => {
          const dateInfo = this.props.matches[matchUid].dateInfo;
          if (
            !dateInfo ||
            !dateInfo.confirmed ||
            !isInFuture(dateInfo.day || catalog[matchUid].reported)
          ) {
            return null;
          }

          const name = profiles[matchUid] && profiles[matchUid].name;
          const pic = profiles[matchUid] && profiles[matchUid].profile_pic;
          return this.displayDateNotif(dateInfo, matchUid, name, pic, index);
        });

      notifDisplay = dateNotifs.concat(unreadNotifs).concat(matchNotifs);
    }

    const noNotifications = !notifDisplay || notifDisplay.every(elt => !elt);

    const noNotifs = noNotifications ? (
      <div className="dropdownItemNoHover">
        <div className="roundPic boxGreenIcon">
          <i className="icon fas fa-check"></i>
        </div>
        <div className="notifBoxBefore boxGreen">
          <div className="textCenter">All caught up! On track to love ❤️</div>
        </div>
      </div>
    ) : null;

    const size = mobile ? `${0.8 * window.screen.width}px` : '435px';

    return (
      <div css={notifDropdownStyle} style={{ width: size }}>
        <div className="titleItem">Notifications</div>

        <hr className="solid" />

        {notifDisplay}
        {noNotifs}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    catalog: state.firebase.data.matchCatalog || {},
    matches: state.firebase.data.matches || {},
    profiles: state.firebase.data.profiles || {},
    updateNotifsPre: notifs => {
      props.firebase.update(`/notifs/${props.uid}/pre/`, notifs);
    },
    updateNotifsPost: notifs => {
      props.firebase.update(`/notifs/${props.uid}/post/`, notifs);
    },
  };
};

export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(NotifDropdown);
