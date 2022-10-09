export const pageProfileSx = {
  '.question-header': {
    marginBottom: '0.5em',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'text',
  },

  '.question-subheader': {
    fontSize: '12px',
    letterSpacing: '0.05em',
    marginBottom: '1em',
  },

  '.label': {
    fontSize: '16px',
    fontWeight: 'medium',
    color: 'text',
  },

  '.body-text': {
    fontSize: '14px',
  },

  '.bottom-elements': {
    marginTop: '20px',
    marginBottom: '20px',
  },

  '.background-border': {
    background: 'white',
    border: theme => `0.5px solid ${theme.colors.mediumGrey}`,
    boxSizing: 'border-box',
    borderRadius: '3px',
  },

  '.profile-container': {
    marginTop: '10px',
  },

  '.profile-pic': {
    float: 'left',
    marginRight: '10px',
  },

  '.profile-input': {
    textAlign: 'left',
    width: '267px',
    height: '33px',
    marginBottom: '3px',
    padding: '1px 10px 1px 10px',
    color: 'black',
    fontSize: '14px',
  },

  '.profile-select': {
    backgroundImage: `url("${window.location.origin}/angle-down.png")`,
    backgroundPosition: '95% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
  },

  '.profile-text-area': {
    textAlign: 'left',
    width: '267px',
    height: '107px',
    color: 'black',
    fontSize: '14px',
  },

  '.prompt-select': {
    maxWidth: '500px',
    width: '100%',
    background: 'greige',
    backgroundImage: `url("${window.location.origin}/angle-down.png")`,
    backgroundPosition: '95% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    border: '0px',
    height: '43px',
    marginBottom: '9px',
    color: '#545353',
  },

  '.prompt-answer': {
    height: '33px',
    marginBottom: '12px',
    marginTop: '5px',
    maxWidth: '600px',
  },

  '.prompt-save': {
    display: 'flex',
    maxWidth: '600px',
    button: {
      marginLeft: 'auto',
    },
  },

  '.text-area-container': {
    display: 'inline-block',
  },

  '.location-container': {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: '7px',
  },

  '.location-input': {
    width: '250px',
    height: '36px',
    marginLeft: '10px',
    marginRight: '10px',
    padding: '1px 10px 1px 10px',
  },

  '.location-select': {
    width: '190px',
    height: '36px',
    marginLeft: '10px',
    marginRight: '10px',
    padding: '1px 10px 1px 10px',

    backgroundImage: `url("${window.location.origin}/angle-down.png")`,
    backgroundPosition: '95% 60%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
  },

  '.campus-select': {
    width: '150px',
  },

  '.checkboxes': {
    paddingTop: '20px',
  },

  '.react-autosuggest__input': {
    height: '36px',
    width: '190px',
    background: 'white',
    border: theme => `0.5px solid ${theme.colors.mediumGrey}`,
    boxSizing: 'border-box',
    borderRadius: '3px',
    margin: '0px 10px',
    fontSize: '14px',
  },

  '.react-autosuggest__suggestions-container': {
    marginLeft: '10px',
    border: 'none',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    background: 'white',
    fontSize: '80%',
    position: 'absolute',
    overflow: 'auto',
    zIndex: '100',
  },

  '.react-autosuggest__suggestion': {
    width: '190px',
    padding: '2px 0 2px 5px',
    border: 'none',
  },

  '@media only screen and (max-width: 900px)': {
    '.location-select': {
      marginBottom: '5px',
    },

    '.country-smaller': {
      marginLeft: '10px',
    },

    '.react-autosuggest__input': {
      marginLeft: '0px',
    },
  },

  '@media only screen and (max-width: 768px)': {
    '.profile-pic': {
      float: 'none',
      textAlign: 'center',
      marginBottom: '10px',
      marginRight: '0px',
    },

    '.profile-select': {
      display: 'block',
      marginRight: 'auto',
      marginLeft: 'auto',
    },

    // redundant b/c not sure what the equivalent for
    // .profile-select, .profile-input {} is
    '.profile-input': {
      display: 'block',
      marginRight: 'auto',
      marginLeft: 'auto',
    },

    '.text-area-container': {
      display: 'block',
    },

    '.profile-text-area': {
      display: 'block',
      marginRight: 'auto',
      marginLeft: 'auto',
    },

    '.country-smaller': {
      // doesn't look so great on desktop, but it works for mobile
      marginLeft: '0px',
      marginBottom: '5px',
    },
  },

  '.save-button': {
    width: '250px',
  },

  '.incomplete-message': {
    marginTop: '5px',
    color: 'red',
    textAlign: 'left',
  },

  '.complete-message': {
    marginTop: '5px',
    color: '#2b652b',
    textAlign: 'left',
  },

  '.react-toggle--checked .react-toggle-track': {
    backgroundColor: '#323232',
  },

  '.react-toggle--checked:hover:not(.react-toggle--disabled) .react-toggle-track': {
    backgroundColor: '#6c2c2c',
  },

  '.react-toggle--checked .react-toggle-thumb': {
    borderColor: '#323232',
  },

  '.autocomplete-menu': {
    borderRadius: '3px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    background: 'white',
    padding: '2px 0',
    fontSize: '90%',
    position: 'absolute',
    width: '100%',
    overflow: 'auto',
    zIndex: '100',
  },

  '.social-container': {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  '.social-input': {
    height: '33px',
    width: '216px',
    margin: '10px',
  },

  '.social-grid': {
    display: 'grid',
    maxWidth: '700px',
    gridTemplateColumns: '325px 325px',
    gridTemplateAreas: [
      `
      'instagram tiktok'
      'snapchat facebook'
      `,
    ],
    justifyContent: 'start',
  },

  '@media only screen and (max-width: 850px)': {
    '.social-grid': {
      gridTemplateColumns: 'auto',
      gridTemplateAreas: 'none',
    },
  },

  '.info-privacy': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '350px',
    marginTop: '15px',
    marginBottom: '8px',
  },

  '.info-icon': {
    marginLeft: '5px',
  },

  '.fa-cog': {
    color: '#4B4B4B',
  },

  '.privacy-layout': {
    display: 'flex',
    alignItems: 'center',
  },

  '.privacy-select': {
    width: '118px',
    height: '20px',
    border: 'none',
    padding: '0px 10px',

    backgroundImage: `url("${window.location.origin}/angle-down.png")`,
    backgroundPosition: '99% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '13px',
  },

  '.privacy-text': {
    fontSize: '12px',
    color: '#4B4B4B',
  },

  '.gender-container': {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '360px',
  },

  '.gender-input': {
    marginRight: '4px',
    width: '98%',
  },

  '.optional-input': {
    display: 'flex',
    height: '33px',
    width: '100%',
    marginBottom: '7px',
  },

  '.gender-select': {
    display: 'flex',
    width: '100%',
    height: '33px',
    left: '428px',
    top: '651px',
    marginBottom: '7px',
    padding: '1px 10px 1px 10px',

    backgroundImage: `url("${window.location.origin}/angle-down.png")`,
    backgroundPosition: '97% 60%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
  },

  '.react-tags': {
    width: '100%',
  },

  '.looking-container': {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
  },

  '.looking-select': {
    marginLeft: '10px',
    width: '220px',
    height: '36px',
    padding: '1px 10px 1px 10px',

    backgroundImage: `url("${window.location.origin}/angle-down.png")`,
    backgroundPosition: '97% 60%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
  },

  '.spotify-container': {
    marginBottom: '10px',
  },
};

export const profileModalSx = {
  '.modal-container': {
    textAlign: 'center',
    padding: '40px',
  },

  '.modal-cancel': {
    cursor: 'pointer',
  },
};
