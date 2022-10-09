/** @jsx jsx */

import { jsx } from 'theme-ui';
import { teamDeckSx, teamProfileSx } from './PageTeamStyles';

const TeamDeck = ({ team, teamColor }) => {
  const displayTeam = team.map((member, index) => {
    return (
      <div key={member.name + index} sx={teamProfileSx}>
        {/* card container with the color of the correct team*/}
        <a
          href={member.url ? member.url : null}
          target="_blank"
          rel="noreferrer"
        >
          <div className="team-card" style={{ backgroundColor: teamColor }}>
            <div className="name-container">{member.name}</div>
            <img
              alt="profile pic"
              className="profile-pic"
              src={member.image_url || require('assets/empty.png').default}
              sx={{
                background: `url(${require('assets/loading.svg').default})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            />
            <div className="text-container">{member.description}</div>
            <div className="school-container">
              <i>{member.school}</i>
            </div>
          </div>
        </a>
      </div>
    );
  });

  return <div sx={teamDeckSx}>{displayTeam}</div>;
};

export default TeamDeck;
