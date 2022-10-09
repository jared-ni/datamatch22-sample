/** @jsx jsx */

import React, { Component } from 'react';
import { jsx, css } from '@emotion/core';
import Sidebar from 'react-sidebar';
import { withRouter } from 'react-router-dom';

import InviteModal from 'components/InviteModal';

import NavbarHeader from 'components/NavbarHeader';
import NavbarFooter from 'components/NavbarFooter';

import {
  footerHeight,
  headerHeight,
  mobileMaxWidth,
  sidebarWidth,
} from 'constants/Navbar';

const navbarStyle = css`
  .MainContent {
    background-color: #f8f8f8;
    opacity: 1;
    min-width: 300px;
    min-height: 100vh;
  }

  .Sidebar {
    background: #ffffff;
    width: ${sidebarWidth}px;
  }
  .overlay {
    position: absolute;
    background-color: #353030;
    height: 120%;
    width: 100%;
    z-index: 50;
    top: 0;
    left: 0;
  }
`;

class Navbar extends Component {
  scrollToTopRef = React.createRef();
  state = {
    // sidebarDocked = sidebar is ALWAYS visible (aka on a desktop not mobile)
    sidebarDocked: true,
    sidebarOpen: false,
    transitions: false,
    modalOpen: false,
  };

  // update window dimensions and sidebar properties
  updateWindowDimensions = () => {
    const sidebarDocked = window.innerWidth > mobileMaxWidth;
    this.setState(state => {
      return {
        sidebarDocked,
        sidebarOpen: sidebarDocked ? false : state.sidebarOpen,
      };
    });
  };

  componentDidMount() {
    this.updateWindowDimensions();

    // resize handler event listener
    window.addEventListener('resize', this.updateWindowDimensions);

    // hacky way to not have the sidebar have transitions on initial load
    this.timer = setTimeout(() => this.setState({ transitions: true }), 100);
  }

  componentWillUnmount() {
    // event listener + timeout cleanup
    window.removeEventListener('resize', this.updateWindowDimensions);
    window.clearTimeout(this.timer);
  }

  // whenever we change pages, we should scroll to the top of the page
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.scrollToTopRef.current.scrollIntoView();
    }
  }

  // function to toggle sidebar, used in navbarheader
  toggleSidebar = () => {
    this.setState(state => ({
      sidebarOpen: !state.sidebarOpen,
    }));
  };

  toggleModal = () => {
    if (!this.state.modalOpen) {
      this.scrollToTopRef.current.scrollIntoView();
    }
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  // this renders the MAIN content, everything else the app shows (not the sidebar)
  renderMainContent = () => {
    const mobile = !this.state.sidebarDocked;
    return (
      <div
        className="MainContent"
        style={{
          paddingBottom: mobile ? footerHeight : 0,
          display: 'flex',
        }}
      >
        <div
          style={{
            overflowY: mobile ? 'auto' : 'hidden',
            overflowX: 'hidden',
            width: '100vw',
            marginTop: headerHeight,
          }}
        >
          {/* this is the actual main content that is surrounded by <Sidebar> tags */}
          {this.props.children}
        </div>
      </div>
    );
  };

  // this renders the sidebar
  renderSidebar = () => {
    // you can conditionally render a different sidebar depending on mobile/desktop
    const mobile = !this.state.sidebarDocked;
    // this is a general sidebar component because it can be used by PageApp or any of the school/date option portals
    const SidebarComponent = this.props.sidebar;
    return (
      // this onClick allows you to close the sidebar (on mobile) after clicking a link
      <div
        style={{ height: '100%' }}
        onClick={() => this.setState({ sidebarOpen: false })}
      >
        <SidebarComponent mobile={mobile} toggleModal={this.toggleModal} />
      </div>
    );
  };

  render() {
    const { isLanding, sidebar } = this.props;
    const { sidebarDocked, sidebarOpen, transitions } = this.state;
    const parts = this.props.location.pathname.split('/');
    const isApp = parts[1] === 'app';

    return (
      <div css={navbarStyle}>
        <NavbarHeader
          isApp={isApp}
          isLanding={isLanding}
          mobile={!sidebarDocked}
          portal={parts[1]}
          sidebarOpen={sidebarOpen}
          toggleSidebar={this.toggleSidebar}
        />
        {/* React sidebar props: https://www.npmjs.com/package/react-sidebar#supported-props */}
        {sidebar ? (
          <Sidebar
            docked={sidebarDocked}
            onSetOpen={sidebarOpen => this.setState({ sidebarOpen })}
            open={sidebarOpen}
            sidebar={this.renderSidebar()}
            sidebarClassName="Sidebar"
            shadow={true}
            transitions={transitions}
          >
            {/* we render the ref at the top so that it will scroll to the top of the page */}
            <div ref={this.scrollToTopRef} />
            {this.state.modalOpen && (
              <InviteModal toggleModal={this.toggleModal} />
            )}
            <div
              className="overlay"
              onClick={this.toggleModal}
              style={{
                opacity: this.state.modalOpen ? 0.6 : 0,
                display: !this.state.modalOpen && 'none',
              }}
            ></div>

            {/* then render the rest of the app's content */}
            {this.renderMainContent(isApp)}
          </Sidebar>
        ) : (
          this.renderMainContent(isApp)
        )}
        {/* if on mobile and in the main application, we render a footer */}
        {!sidebarDocked && isApp && <NavbarFooter />}
      </div>
    );
  }
}

// need withRouter to access location pathname
export default withRouter(Navbar);
