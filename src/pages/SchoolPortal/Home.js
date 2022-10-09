/** @jsx jsx */

import { Component } from 'react';
import { jsx, Button } from 'theme-ui';

import Container from 'components/Container';
import Header from 'components/Header';
import Link from 'components/Link';

const resources = [
  {
    name: 'Playbook README',
    link:
      'https://drive.google.com/drive/folders/14XxbYO0Wrrm2oetgiFlbqxdwcULgHxNf?usp=sharing',
    linkText: 'Google Drive',
  },
  {
    name: 'Survey question inspiration',
    link:
      'https://drive.google.com/drive/folders/1hPUROzzpku7YMrk-CMQJyjftAk4RIlTp?usp=sharing',
    linkText: 'Google Drive',
  },
  {
    name: 'Designs',
    link:
      'https://www.figma.com/file/cgWObjRres82qe8XOebEQgo3/Datamatch?node-id=12395%3A26394',
    linkText: 'Figma',
  },
  {
    name: 'General publicity materials',
    link:
      'https://drive.google.com/drive/folders/18MMisd2cFNBlne2mqK41GmzTWa6XJuLg?usp=sharing',
    linkText: 'Google Drive',
  },
  {
    name: 'Join Slack',
    link:
      'https://join.slack.com/t/hcsdatamatch/shared_invite/zt-12y33r2z4-ndOXlwTtX8SI3OmVSBpSaA',
    linkText: 'Link',
  },
];

class Home extends Component {
  render() {
    const school = this.props.school || 'school';
    return (
      <Container>
        <div>
          <Header>University Portal</Header>
          <br />
          <b>Welcome to the {school} Datamatch portal!</b>
          <br />
          Here is where you’ll edit your school details and the survey. The
          tentative deadline to get all your school details (not including date
          options) in is 9 pm on February 6, 2022. Updates can still be made
          after this time but make sure to notify us to have your changes
          reflected. Date options must be submitted by 11:59 pm on February 12,
          2022, after which edits can no longer be made.
          <br />
          <br />
          <b>Resources:</b>
          <br />
          {resources.map((resource, i) => (
            <p key={i}>
              {resource.name}
              {': '}
              <a href={resource.link} rel="noopener noreferrer" target="_blank">
                {resource.linkText}
              </a>
            </p>
          ))}
          <br />
          <div className="links">
            <Link to="/school_portal/school">
              <Button mr={2}>Edit School Information</Button>
            </Link>
            <Link to="/school_portal/team">
              <Button mr={2}>Edit Team Member Information</Button>
            </Link>
            <Link to="/school_portal/survey">
              <Button>Edit Survey</Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }
}

export default Home;
