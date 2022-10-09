export const pageTeamSx = {
  '.cover': {
    width: '300px',
    float: 'left',
  },

  '.team-container': {
    marginBottom: '20px',
    marginTop: '20px',
    display: 'flex',
    flexWrap: 'wrap',
  },

  '.team-cover': {
    width: '175px',
    height: '255px',
    border: theme => `1px solid ${theme.colors.offWhite}`,
    position: 'relative',
    marginRight: '10px',
    marginBottom: '20px',
    marginTop: '20px',
  },

  '.team-header-container': {
    position: 'relative',
    ml: 0,
    minHeight: '1em', // hardcoded, need to modify to fit children
    fontFamily: 'heading',
    fontWeight: 'bold',
    fontSize: 4,
    marginBottom: '20px',
  },

  '.team-box': {
    position: 'absolute',
    width: '170px',
    height: '40px',
    top: 0,
    left: 0,
    zIndex: 1,
    border: theme => `1px solid ${theme.colors.text}`,
    bg: 'lightBlue',
    color: 'text',
    p: 10,
    textAlign: 'center',
    cursor: 'pointer',
  },

  '.team-underlay': {
    position: 'absolute',
    width: '170px',
    height: '40px',
    top: 1,
    left: 1,
    border: theme => `1px solid ${theme.colors.text}`,
    p: 10,
    textAlign: 'center',
    cursor: 'pointer',
  },
};

export const teamDeckSx = {
  display: 'flex',
  flexWrap: 'wrap',
  marginBottom: '20px',
};

export const teamProfileSx = {
  '.text-container': {
    //   Control opacity of text and container separately with rgb
    width: '155px',
    height: '155px',
    backgroundColor: 'transparent',
    color: 'rgb(0,0,0,0.0)',
    position: 'absolute',
    top: '60px',
    left: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px',
    textAlign: 'center',

    '&:hover': {
      backgroundColor: 'rgb(255,255,255,0.5)',
      color: 'rgb(0,0,0,1.0)',
    },
  },

  '.name-container': {
    position: 'absolute',
    top: '10px',
    left: '10px',
    color: 'white',
    // control opacity with rgb
    textShadow: '0px 2px rgb(0,0,0,0.4)',
    fontSize: '20px',
  },

  '.school-container': {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    color: 'white',
    textShadow: '0px 2px rgb(0,0,0,0.4)',
    fontSize: '24px',
  },

  '.profile-pic': {
    width: '155px',
    height: '155px',
    position: 'absolute',
    objectFit: 'cover',
    objectPosition: 'center',
    top: '60px',
    left: '10px',
    textAlign: 'center',
    border: theme => `1px solid ${theme.colors.offWhite}`,
  },

  '.team-card': {
    width: '175px',
    height: '260px',
    backgroundColor: 'offWhite',
    color: 'offWhite',
    position: 'relative',
    marginTop: '20px',
    marginRight: '10px',
    borderRadius: '3px',
  },
};
