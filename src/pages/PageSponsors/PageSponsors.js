/** @jsx jsx */

import { Component } from 'react';
import { jsx } from 'theme-ui';

import Container from 'components/Container';
import Header from 'components/Header';
import Sponsors from 'components/Sponsors';

import { Mixpanel } from 'utils/mixpanel.js';

import { pageSponsorsSx } from 'pages/PageSponsors/PageSponsorsStyles';

export default class PageSponsors extends Component {
  componentDidMount() {
    // Web analytics
    Mixpanel.track('Sponsors_Page', {});
  }

  render() {
    return (
      <Container sx={pageSponsorsSx}>
        <div>
          <Header>Sponsors</Header>
          <p>
            Our sponsors help us cover our costs of operations so we can run
            every year for free! Check them out if you want to support us. We do
            not share any data with our sponsors.
          </p>
        </div>
        <Sponsors college={this.props.college} blurbLocation="sponsors-page" />
      </Container>
    );
  }
}
