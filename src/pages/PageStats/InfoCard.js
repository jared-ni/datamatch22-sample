/** @jsx jsx */

import { jsx } from 'theme-ui';

const infoBoxSx = {
  '.element-container': {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: '300px',
  },

  '.info-box': {
    position: 'relative',
    zIndex: 1,
    background: 'white',
    border: theme => `1px solid ${theme.colors.blue}`,
    borderRadius: '1px',
    padding: '1.5em',
    width: [200, 200, 200],
    height: [200, 200, 200],
  },

  '.underlay': {
    position: 'relative',
    zIndex: 0,
    backgroundColor: 'lightPink',
    width: [200, 200, 200],
    height: [200, 200, 200],
    marginTop: '-190px',
    marginLeft: '10px',
  },

  p: {
    fontSize: '14.5px',
  },
};

const InfoCard = ({ children }) => {
  return (
    <div className="element-container" sx={infoBoxSx}>
      <div className="info-box">{children}</div>
      <div className="underlay"></div>
    </div>
  );
};

export default InfoCard;
