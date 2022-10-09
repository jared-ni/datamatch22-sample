import Background from './img/background-homepage.png';

export const pageHomeSx = {
  '#PageHome': {
    backgroundImage: `url(${Background})`,
    backgroundSize: 'cover',
    width: '100%',
    backgroundPosition: 'right -100px',

    '@media (max-width: 995px)': {
      backgroundImage: 'none',
    },
  },

  h1: {
    marginLeft: '0px',
    marginBottom: '20px',
  },

  h4: {
    color: 'pink',
  },

  '.headline': {
    color: '#D7525B',
    fontSize: '40px',
  },

  '.caption': {
    width: '60%',
  },

  '.link, .link:hover': {
    color: 'blue',
    fontStyle: 'italic',
    fontWeight: 'normal',
  },

  '.flex-container': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'center',
    // marginLeft: '-100px',
  },

  // '.flex-box': {
  //   marginLeft: '20px',
  //   marginRight: '50px',
  // },
  '.page-home-bottom': {
    display: 'flex',
    // width: '120%',
    justifyContent: 'space-between',
  },
  '.page-home-left': {
    height: '460px',
    background: '#FFFFFF',
    border: '1px solid #524F6C',
    boxSizing: 'border-box',
    borderRadius: '3px',
    marginBottom: '3rem',
    boxShadow: '#F5E3E3 6px 6px',
  },
  '.page-home-section': {
    height: 'fluid',
    background: '#FFFFFF',
    border: '1px solid #524F6C',
    boxSizing: 'border-box',
    borderRadius: '3px',
    padding: '15px',
    paddingTop: '25px',
    boxShadow: '#F5E3E3 6px 6px',
  },

  '.page-home-section-btn': {
    height: '34px',
    left: '279px',
    top: '623px',

    boxSizing: 'border-box',
    borderRadius: '3px',
    marginBottom: '10px',
  },

  '.osu-fundraiser': {
    border: '1px solid #524F6C',
    boxSizing: 'border-box',
    borderRadius: '3px',
    padding: '15px',
    paddingTop: '25px',
    boxShadow: '#F5E3E3 6px 6px',
    marginBottom: '40px',
  },

  '.flex-box-1': {
    marginLeft: '20px',
    marginRight: '20px',
    width: '850px',
  },

  '.element-container': {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: '100vw',
  },

  '.element-grid': {
    display: 'grid',
    // added width
    width: '100%',
    gridTemplateRows: '300px 300px',
    // gridTemplateColumns: '398px',
    gridTemplateColumns: '2fr 2fr',
    gridColumnGap: '3rem',
    marginLeft: '10px',
    justifyItems: 'center',
  },

  '.sponsors img': {
    width: '150px',
    padding: '15px',
  },

  '.info-box': {
    position: 'relative',
    zIndex: 1,
    background: 'white',
    border: theme => `1px solid ${theme.colors.blue}`,
    borderRadius: '1px',
    padding: '2em',
    width: ['90%', 398, 398],
    height: [320, '250.15px', '250.15px'],
  },

  '.story-title': {
    color: 'blue',
    fontSize: '20px',
  },

  '.story-container': {
    position: 'relative',
    marginLeft: '1em',
    marginTop: '2em',
    textAlign: 'center',
  },

  '.stats-container': {
    maxWidth: 800,
  },

  '.centered-link': {
    textAlign: 'center',
  },

  '.checkbox': {
    width: '30px',
    height: '30px',
    backgroundColor: 'red',
    borderRadius: '3px',
    background: '#F5E3E3',
    position: 'relative',
    right: '15px',
    border: '1px solid #D9565D',
  },

  '.arrow-heart': {
    width: '37px',
    position: 'relative',
    left: '8px',
    bottom: '10px',
  },

  '.overlay': {
    position: 'absolute',
    backgroundColor: '#353030',
    height: '120%',
    width: '100%',
    zIndex: 50,
    top: 0,
    left: 0,
  },

  // Not working on mobile, is there a better way to do this?

  '.modal-open': {
    overflow: 'hidden',
    position: 'fixed',
  },

  '.toggle-link, .arrow': {
    cursor: 'pointer',
  },

  '@media only screen and (max-width: 1075px)': {
    '.PageHome': { marginLeft: '0.5em' },

    '.element-grid': {
      gridTemplateRows: 'auto',
      justifyItems: 'start',
      gridColumnGap: '1rem',
    },

    '.caption': {
      width: '100%',
    },

    '.story-container': {
      margin: '2em 1em',
    },
    '.flex-container': {
      flexDirection: 'column',
      marginLeft: '0px',
    },
    '.flex-box': {
      marginLeft: '0px',
      marginRight: '20px',
    },
    '.flex-box-1': {
      marginLeft: '0px',
      marginRight: '20px',
      width: '75vw',
    },
  },

  '.multi-select': {
    width: '300px',
    fontSize: '16px',
    fontWeight: '300',
    marginLeft: '10px',
    height: '36px',
    boxSizing: 'border-box',
    borderRadius: '3px',

    '--rmsc-main': '#D7525B',
    '--rmsc-hover': '#F4F2F2',
    '--rmsc-selected': '#F5E3E3',
    '--rmsc-border': '#B1B1B1',
    '--rmsc-gray': 'black',
    '--rmsc-bg': 'white',
    '--rmsc-radius': '3px' /* Radius */,
    '--rmsc-h': '36px' /* Height */,
  },

  '.stats-multi-select': {
    width: '250px',
    fontSize: '16px',
    fontWeight: '300',
    marginLeft: '20px',
    marginTop: '12px',
    height: '36px',
    boxSizing: 'border-box',
    borderRadius: '3px',

    '--rmsc-main': '#D7525B',
    '--rmsc-hover': '#F4F2F2',
    '--rmsc-selected': '#F5E3E3',
    '--rmsc-border': '#B1B1B1',
    '--rmsc-gray': 'black',
    '--rmsc-bg': 'white',
    '--rmsc-radius': '3px' /* Radius */,
    '--rmsc-h': '36px' /* Height */,
  },

  '.dropdown-content input[type=checkbox]': {
    width: '15px',
  },

  '.select-item': {
    height: '48px',
    verticalAlign: 'top',
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBotton: 0,
  },

  '.stats-select': {
    background: 'white',
    border: theme => `0.5px solid ${theme.colors.mediumGrey}`,
    backgroundImage: `url("${window.location.origin}/angle-down.png")`,
    backgroundPosition: '97% 60%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    borderRadius: '3px',
    boxSizing: 'border-box',
    marginLeft: '20px',
    marginTop: '7px',
    width: '250px',
    height: '36px',
    padding: '1px 10px 1px 10px',
    fontSize: '16px',
    fontWeight: '300',
  },
};

export const oneSlotSx = {
  '.item': {
    borderStyle: 'dashed',
  },

  '.emoji': {
    minWidth: 78,
    minHeight: '8400px',
    background: 'white',
    borderWidth: '100px',
    zIndex: 1,

    display: 'block',
    width: 'auto',
    height: 'auto',
  },

  '.border': {
    border: '7px solid #555',
    borderRadius: '10px',
    position: 'relative',
    bottom: '500px',
    marginLeft: 'auto',
    marginRight: 'auto',

    maxWidth: '70px',
    maxHeight: '200px',
    zIndex: 2,
  },
};

export const storySubmissionSx = {
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: ['80%', '60%', '50%'],
  zIndex: '100',
  position: 'absolute',
  borderRadius: '8px',
  margin: 'auto',
  backgroundColor: theme => theme.colors.background,
  padding: '2em',

  '.sub-label': {
    marginBottom: '1em',
  },

  '.error': {
    color: theme => theme.colors.red,
  },

  '.textarea': {
    backgroundColor: '#fff',
    marginBottom: '1em',
  },
};
