/** @jsx jsx */

import { css } from '@emotion/core';
import { jsx, Grid, Box } from 'theme-ui';
import { Mixpanel } from 'utils/mixpanel';
import sponsors from 'constants/sponsors.json';

const sponsorStyle = css`
  padding: 1em;
  margin: 2em 0;
  img {
    max-width: 200px;
    max-height: 200px;
    width: 100%;
    padding: 16px;
  }
  .text {
    margin-left: 1em;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  a:hover,
  a:visited,
  a:link,
  a:active {
    text-decoration: none;
  }
`;

const Sponsor = ({ sponsor, college }) => {
  return (
    <div
      css={sponsorStyle}
      sx={{
        backgroundColor: 'offWhite',
        ':hover': { backgroundColor: 'greige' },
      }}
    >
      <a
        onClick={() =>
          Mixpanel.track('Sponsor_Clicked', {
            sponsor: sponsor.name,
            college: college,
          })
        }
        href={sponsor.url}
        target="_blank"
        rel="noreferrer"
      >
        <Grid grap={10} columns={[2, null, '1fr 2fr']}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              alt={sponsor.name + '-logo'}
              src={sponsor.logo || require('assets/empty.png').default}
            />
          </Box>
          <Box className="text">
            <h4>{sponsor.name}</h4>
            <div
              sx={{
                color: 'text',
                fontWeight: 400,
                fontSize: ['12px', null, '1em'],
              }}
            >
              {sponsor.tagline && (
                <div>
                  <p>{sponsor.tagline}</p> <br />
                </div>
              )}
              <p>{sponsor.description}</p>
            </div>
          </Box>
        </Grid>
      </a>
    </div>
  );
};

/* renders custom sponsor footer depending on the college you are at */
const tierMap = { aurora: 0, rose: 1, cupid: 2 };
const Sponsors = ({ college, blurbLocation }) => {
  return sponsors
    .filter(s => s.schools === 'All' || s.schools.includes(college))
    .filter(s => s.blurbLocations && s.blurbLocations.includes(blurbLocation))
    .sort((s1, s2) => tierMap[s1.tier] - tierMap[s2.tier])
    .map(s => <Sponsor key={s.name} sponsor={s} college={college} />);
};

export default Sponsors;
