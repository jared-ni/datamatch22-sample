/** @jsx jsx */

import { jsx, Button } from 'theme-ui';

const NUM_ARTISTS_SHOWN = 2;

const spotifyDisplaySx = {
  button: {
    bg: 'greige',
    border: theme => `1px solid ${theme.colors.mediumGrey}`,
    borderRadius: '3px',
    color: 'black',
    fontStyle: 'italic',
    marginBottom: '3px',
    marginRight: '3px',
    padding: '4px',
    paddingLeft: '6px',
    paddingRight: '12px',
    ':active': {
      bg: 'mediumGrey',
      color: 'black',
    },
    ':focus': {
      outline: 'none',
    },
  },
  img: {
    borderRadius: '50px',
    height: '22px',
    width: '22px',
    border: '1px solid #EF798A',
    boxSizing: 'border-box',
  },
  '.spotify-name': {
    marginLeft: '5px',
    fontSize: '14px',
    lineHeight: '20px',
    color: 'black',
  },
};

const SpotifyDisplay = ({ objects = [] }) => {
  if (objects.length === 0) {
    return <div>You have no top artists :(</div>;
  }

  const mappedButtons = objects.map(({ image, link, name }) => (
    <Button key={name} onClick={() => window.open(link)}>
      <img alt={name} src={image} />
      <span className="spotify-name">{name}</span>
    </Button>
  ));
  return (
    <div sx={spotifyDisplaySx}>
      {mappedButtons.length > NUM_ARTISTS_SHOWN
        ? mappedButtons.slice(0, NUM_ARTISTS_SHOWN)
        : mappedButtons}
    </div>
  );
};
export default SpotifyDisplay;
