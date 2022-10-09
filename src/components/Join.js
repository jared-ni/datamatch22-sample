import React from 'react';

import Email from 'components/Email';
import StatsBlurb from 'assets/statsblurb.png';

const teamToBlurb = {
  Algorithm: (
    <div>
      If you’re interested in using statistical modeling to optimize the love
      lives of college students, join us!
    </div>
  ),
  Business: (
    <div>
      Do you not want anything to do with all that boring coding stuff? We’re in
      charge of everything *actually fun*: *organizing dates with free food*,
      social media, *organizing this survey*, finance, budgeting, and more! Join
      Business and become a member of our *beautiful* family :D
    </div>
  ),
  Design: (
    <div>
      Do you have an opinion on the spacing of this page? Can you name this
      typeface without clicking Inspect Element? Join Datamatch Design!
    </div>
  ),
  Stats: (
    <div>
      <img
        style={{ maxWidth: '500px', width: '100%' }}
        alt="Stats blurb"
        src={StatsBlurb}
      />
    </div>
  ),
  Web: (
    <div>
      Love this web app and want to be part of the team that builds it? Comp the
      Datamatch Web Team to learn web dev using React and Firebase and build out
      a website used by tens of thousands of college students every year!
    </div>
  ),
};

// This component shows a blurb for the specific team we are pitching and a sign up form
// that takes in the user's email for their interest in the specific team

const Join = ({ team }) => {
  const blurb = teamToBlurb[team];
  return (
    <div
      style={{
        textAlign: 'center',
        background: 'rgb(186, 224, 232, 0.4)',
        padding: '20px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: 200,
        maxWidth: 600,
      }}
    >
      <h5 style={{ marginBottom: 0, textAlign: 'center' }}>
        Join the Datamatch {team} team!
      </h5>
      <br />
      {blurb && (
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          {blurb}
        </div>
      )}
      <br />
      <Email center team={team} />
    </div>
  );
};

export default Join;
