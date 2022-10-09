export const pagePreMatchSx = {
  padding: '2em',

  '.center-content': {
    height: 'auto',
    margin: '0 auto',
    maxWidth: '800px',
    padding: '40px',
    position: 'relative',
    width: '80%',
  },

  '.pinkButton': {
    backgroundColor: 'pink',
    borderColor: 'primary',
    borderRadius: '2px',
    borderStyle: 'solid',
    borderWidth: '1px',
    color: 'white',
    display: 'block',
    fontSize: '25px',
    fontStyle: 'normal',
    fontWeight: 'bold',
    lineHeight: '116%',
    margin: '0 auto',
    padding: '15px 15px',
    textDecoration: 'none',
  },

  '.matches-container': {
    display: 'flex',
    flexWrap: 'nowrap',
    margin: '15px',
  },

  '.match': {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  '@media (max-width: 1098px)': {
    '.center-content': {
      height: 'auto',
      margin: '0 auto',
      padding: '10px',
      position: 'relative',
      width: '90%',
    },

    '.match:first-child': {
      right: '20%',
      position: 'absolute',
      zIndex: 0,

      '.matchDescription': {
        visibility: 'hidden',
      },
    },

    '.match:nth-child(2)': {
      margin: '6px auto',
      transform: 'scale(1.14)',
      zIndex: 1,
    },

    '.match:nth-child(3)': {
      position: 'absolute',
      zIndex: 0,
      left: '20%',

      '.matchDescription': {
        visibility: 'hidden',
      },
    },
  },
};

export const matchRevealViewSx = {
  fontSize: 2,
  marginBottom: '30px',

  '.profilePic': {
    width: '100%',
    userDrag: 'none',
    userSelect: 'none',
  },

  '.parent-container': {
    position: 'relative',
  },

  '.box': {
    bg: 'lightPink',
    border: theme => `1px solid ${theme.colors.text}`,
    color: 'text',
    left: 0,
    p: 3,
    position: 'relative',
    top: 0,
    width: '170px',
    zIndex: 1,
  },

  '.underlay': {
    backgroundColor: 'white',
    border: theme => `1px solid ${theme.colors.text}`,
    height: '170px',
    left: 1,
    padding: 35, // needs > 5
    position: 'absolute',
    right: -1,
    top: 1,
    width: '170px',
  },

  '.image-container': {
    border: '1px solid #524F6C',
    color: 'white',
    overflow: 'hidden',
    position: 'relative',
    textAlign: 'center',
  },

  '.header-rating': {
    color: 'pink',
    display: 'none',
    fontSize: '36px',
    fontStyle: 'normal',
    fontWeight: 'bold',
    left: '50%',
    lineHeight: '75.32%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },

  '.image-container:hover .header-rating': {
    display: 'block',
  },

  '.image-container:hover .profilePic': {
    opacity: '50%',
  },

  // '@media (max-width: 700px)': {
  //   marginBottom: 0,
  //   img: {
  //     height: 'auto',
  //     width: '100%',
  //     maxWidth: '500px',
  //   },
  // },
};
