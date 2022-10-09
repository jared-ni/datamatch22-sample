export const pageResultsSx = {
  '.header-text': {
    fontSize: '22px',
    fontWeight: 'bold',
    textAlign: 'left',
  },

  '.body-text': {
    textAlign: 'center',
    marginTop: '5px',
  },

  '.components-container': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  '.top-container': {
    backgroundColor: '#FFFFFF',
    border: '2px solid #524F6C',
    position: 'relative',
    boxSizing: 'border-box',
    borderRadius: '3px',
    padding: '20px',
    width: '533px',
    boxShadow: '7px 7px #F5E3E3',
  },

  '#match-prefs': {
    position: 'relative',
    left: '17%',
    top: 10,
    transform: 'scale(1.25)',
  },

  '.grid-container': {
    boxSizing: 'border-box',
    margin: 0,
    minWidth: 0,
    display: 'grid',
    gridGap: '16px',
    gridTemplateColumns: 'repeat(2,1fr)',
  },

  '.wheel': {
    alignSelf: 'start',
  },

  '.preferences': {
    alignSelf: 'center',
  },

  '.schedule': {
    alignSelf: 'center',
    width: '100%',
  },

  '@media (max-width: 900px)': {
    '.header-text': {
      fontSize: '20px',
    },

    '.grid-container': {
      padding: '15px',
      gridTemplateColumns: '70% 25%',
    },

    '.top-container': {
      maxWidth: '100%',
    },

    '#match-prefs': {
      transform: 'none',
      top: 0,
      left: 0,
    },
  },

  '@media (max-width: 600px)': {
    '.grid-container': {
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'repeat(2,1fr)',
      justifyItems: 'center',
    },

    '#match-prefs': {
      transform: 'scale(0.9)',
      top: 0,
      left: -3,
    },

    '.preferences': {
      width: '40%',
    },

    '.top-container': {
      width: '80%',
    },
  },

  '@media (max-width: 450px)': {
    '.top-container': {
      position: 'relative',
      right: '14%',
    },

    '.preferences-container': {
      position: 'relative',
      right: '35%',
    },
  },
};

export const preferencesSx = {
  '.preferences-container': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '379px',
    background: theme => `${theme.colors.greige}`,
    border: '1.5px solid rgba(82, 79, 108, 0.8)',
    boxSizing: 'border-box',
    borderRadius: '3px',
    padding: '20px',
    boxShadow: '7px 7px #DEDEF0',
  },

  '.header': {
    fontWeight: 'bold',
    fontSize: ['17px', '20px'],
  },

  '.regular-text': {
    fontSize: ['12px', '16px'],
    textAlign: 'left',
  },

  '.small-text': {
    fontSize: '10px',
    fontStyle: 'italic',
    color: theme => `${theme.colors.pink}`,
  },

  '.icon-space': {
    paddingLeft: '4px',
  },

  '.button-container': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '9px',
  },

  '.button': {
    width: ['90%', '90%'],
    maxWidth: '110px',
    height: '40px',
    fontSize: ['12px', '14px'],
    borderSizing: 'border-box',
    borderRadius: '3px',
    marginBottom: ['8px', '9px'],
    ':focus': {
      outline: theme => `1px dotted ${theme.colors.blue}`,
    },
  },

  '.button-unclicked': {
    color: theme => `${theme.colors.blue}`,
    background: theme => `${theme.colors.offWhite}`,
    border: theme => `1.5px solid ${theme.colors.blue}`,
  },

  '.button-unclicked: hover': {
    background: theme => `${theme.colors.lightBlue}`,
  },

  '.button-clicked': {
    color: theme => `${theme.colors.offWhite}`,
    background: theme => `${theme.colors.blue}`,
  },

  '@media (min-width: 641px) and (max-width: 850px)': {
    '.regular-text': {
      fontSize: '15px',
    },

    '.button': {
      width: '75%',
      height: '30px',
      fontSize: '12px',
      borderSizing: 'border-box',
      borderRadius: '3px',
      marginBottom: '8px',
    },
  },
};
