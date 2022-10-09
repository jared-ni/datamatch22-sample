/** @jsx jsx */

import { Component } from 'react';
import { jsx, Grid } from 'theme-ui';

import Navbar from 'components/Navbar';
import LandingChat from 'pages/PageMain/LandingChat';

import logoCircle from 'assets/logo-circle.svg';
import logoHeart from 'assets/logo-heart.svg';
import penguin from 'assets/penguin.gif';

import { liveLandingSx } from 'pages/PageMain/PageMainStyles';

class LiveLanding extends Component {
  state = { mobile: false, popupActive: false };

  // update window dimensions and sidebar properties
  updateWindowDimensions = () => {
    this.setState({
      mobile: window.innerWidth <= 1000,
    });
  };

  componentDidMount() {
    this.updateWindowDimensions();

    // resize handler event listener
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  handleEmblemClick = () => {
    this.setState({ popupActive: !this.state.popupActive });
  };

  renderDesktop = () => {
    const { totalUsers } = this.props;

    return (
      <Grid className="landingContainer" columns={3}>
        <div className="emblemContainer">
          <div className="emblem" onClick={this.handleEmblemClick}>
            <img src={logoHeart} alt="logoHeart" style={{ height: 100 }} />
            <img
              src={logoCircle}
              className="logoCircle"
              alt="logoCircle"
              style={{ height: 240 }}
            />
            <div
              className={`popup ${
                this.state.popupActive ? 'popup-active' : ''
              }`}
            >
              <img src={penguin} alt="penguin" style={{ height: 80 }} />
            </div>
          </div>
        </div>
        <div className="headlineContainer">
          <div>
            <div className="headline">{totalUsers.toLocaleString()}</div>
            <br />
            <div className="subline">people have signed up for Datamatch</div>
          </div>
        </div>
        <div className="chatContainer">
          <LandingChat />
        </div>
      </Grid>
    );
  };

  renderMobile = () => {
    const { totalUsers } = this.props;

    return (
      <Grid gap={2} columns={'1fr'} className="landingContainer">
        <div className="mobileEmblemContainer">
          <div className="emblem">
            <div className="circleBg"></div>
            <img src={logoCircle} alt="logoCircle" style={{ height: 300 }} />
            <div className="mobileHeadlineContainer">
              <div className="mobileHeadline">
                {totalUsers.toLocaleString()}
              </div>
              <br />
              <div className="mobileSubline">users and counting...</div>
            </div>
          </div>
        </div>
        <div className="mobileChatContainer">
          <LandingChat mobile />
        </div>
      </Grid>
    );
  };

  render() {
    const { mobile } = this.state;
    return (
      <div sx={liveLandingSx}>
        <Navbar isLanding={true}>
          {mobile ? this.renderMobile() : this.renderDesktop()}
        </Navbar>
      </div>
    );
  }
}

export default LiveLanding;
