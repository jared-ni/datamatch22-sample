/** @jsx jsx */

import { Component } from 'react';
import { jsx } from 'theme-ui';
import ReactTooltip from 'react-tooltip';

const notifBannerSx = {
  '.banner-class': {
    textAlign: 'center',
    padding: '10px',
    fontSize: '14px',
    color: 'white',
    background: theme => `${theme.colors.pink}`,
  },
  '.dismiss': {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  '.info': {
    cursor: 'default',
  },
};

class NotifBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerHeight: null,
    };
  }

  resizeNotifBanner = () => {
    const height = document.getElementById('notif-banner').clientHeight;
    if (height !== this.state.bannerHeight) {
      this.setState({ bannerHeight: height });
      this.props.getNotifBannerHeight(height);
    }
  };

  componentDidMount = () => {
    window.addEventListener('resize', this.resizeNotifBanner);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resizeNotifBanner);
  };

  componentDidUpdate = () => {
    this.resizeNotifBanner();
  };

  render() {
    const { dismissNotifBanner, showNotifBanner } = this.props;

    if (!showNotifBanner) {
      return <div id="notif-banner"></div>;
    }

    return (
      <div sx={notifBannerSx}>
        <div id="notif-banner" className="banner-class">
          For the best experience, <b>turn on desktop notifications</b> so you
          know when your matches message you back :)
          <br />
          <span
            data-tip={
              'On Chrome, you can do this by <br />\
              clicking the lock to the left of the <br />\
              website url, and then enabling <br />\
              notifications in the "Site settings."'
            }
            className="info"
          >
            <i className="fas fa-info-circle info-icon"></i>
            <ReactTooltip place="right" multiline={true} />
          </span>{' '}
          &nbsp;&nbsp;
          <span className="dismiss cursor" onClick={dismissNotifBanner}>
            Dismiss
          </span>
        </div>
      </div>
    );
  }
}

export default NotifBanner;
