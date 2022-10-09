/** @jsx jsx */

import { Component } from 'react';
import { jsx } from 'theme-ui';

import { matchRevealViewSx } from 'pages/PagePreMatch/PagePreMatchStyles';

class MatchRevealView extends Component {
  render() {
    const { match, user } = this.props;

    // if the user doesn't exist (account deleted), we don't show the match
    if (!user) {
      return null;
    }

    // pull the necessary attributes off the other user's profile
    const { college, dorm, profile_pic, year } = user;

    // pull match attributes necessary
    const { rating, relationshipType } = match || {};

    const love = relationshipType === 'true love';

    return (
      <div sx={matchRevealViewSx}>
        <div className="parent-container">
          <div className="box">
            <div className="image-container">
              <img
                alt="profile pic"
                className="profilePic"
                src={profile_pic || require('assets/empty.png').default}
                sx={{
                  objectFit: 'cover',
                  background: `url(${require('assets/loading.svg').default})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  filter: 'blur(6px)',
                }}
              />
              {rating ? (
                <div className="header-rating">
                  {(rating * 100).toFixed(2)}%<br />
                  <span style={{ fontSize: '20px' }}>
                    {`${love ? 'love' : 'friendship'}`}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Redundant picture to match the size of box */}
          <div className="underlay"></div>
        </div>
        <div
          className="matchDescription"
          style={{
            textAlign: 'center',
            marginTop: '15px',
            marginBottom: '40px',
          }}
        >
          {college}
          {year && ' ' + year}
          {dorm && ', ' + dorm}
        </div>
      </div>
    );
  }
}

export default MatchRevealView;
