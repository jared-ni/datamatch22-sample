export const pageOnboardSx = {
  backgroundColor: 'offWhite',
  minHeight: '100vh',

  // br for the space btw gender blocks
  '.special-br': {
    display: 'block',
    margin: '9px 0',
  },

  '.header': {
    padding: '20px',
    textAlign: 'center',
    width: '100%',
    fontWeight: 'bold',
  },

  '.logo-container': {
    display: 'inline-block',
    width: '200px',
    marginBottom: '20px',
  },

  '.form': {
    margin: '0 auto',
    width: '540px',
    maxWidth: '90vw',
    textAlign: 'center',
    backgroundColor: 'black',
    border: theme => `3px solid ${theme.colors.primary}`,
    padding: '10px 20px 0px 20px',
  },

  '.input-container': {
    textAlign: 'left',
    opacity: '1',
    transition: 'opacity 5s height 5s',
    display: 'inline-block',
    width: '100%',
  },

  'input::placeholder': {
    color: '#323232',
  },

  '.logout-container': {
    display: 'block',
    textAlign: 'center',
    marginTop: '10px',
    marginBottom: '10px',
  },

  '.question-header': {
    marginBottom: '0.5em',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'offWhite',
  },

  '.info-privacy': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '350px',
    marginTop: '15px',
    marginBottom: '8px',
    color: 'white',
  },

  '.info-icon': {
    marginLeft: '5px',
  },

  '.fa-cog': {
    color: 'white',
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

    backgroundImage: 'url(https://image.flaticon.com/icons/svg/60/60781.svg)',
    backgroundPosition: '99% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '13px',
  },

  '.privacy-text': {
    fontSize: '12px',
    color: 'white',
  },

  '.gender-container': {
    textAlign: 'left',
    opacity: '1',
    transition: 'opacity 5s height 5s',
    display: 'inline-block',
    width: '100%',
  },

  '.gender-input': {
    display: 'block',
    boxSizing: 'border-box',
  },

  '.gender-select': {
    display: 'flex',
    width: '353px',
    height: '33px',
    left: '428px',
    top: '651px',
    marginBottom: '7px',
    padding: '1px 10px 1px 10px',
  },

  '.label': {
    fontSize: '16px',
    fontWeight: 'medium',
    color: 'text',
  },

  '.body-text': {
    fontSize: '14px',
  },

  '.background-border': {
    backgroundColor: 'offWhite',
    border: theme => `0.5px solid ${theme.colors.mediumGrey}`,
    boxSizing: 'border-box',
    borderRadius: '3px',
  },

  '.profile-container': {
    marginTop: '10px',
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

  '.text-area-container': {
    display: 'inline-block',
  },

  '.greeting': {
    border: theme => `2px solid ${theme.colors.lightPink}`,
    backgroundColor: 'offWhite',
    padding: '8px',
    fontSize: '14px',
    borderRadius: '3px',
    '&:hover': {
      cursor: 'pointer',
    },
  },

  '.greeting-selected': {
    border: theme => `2px solid ${theme.colors.primary}`,
    backgroundColor: 'lightPink',
    color: 'primary',
  },

  p: {
    color: 'offWhite',
    paddingBottom: '5px',
  },

  '@media only screen and (max-width: 768px)': {
    '.profile-pic': {
      float: 'none',
      marginBottom: '10px',
      marginRight: '0px',
    },

    '.profile-select': {
      display: 'block',
    },

    // redundant b/c not sure what the equivalent for
    // .profile-select, .profile-input {} is
    '.profile-input': {
      display: 'block',
    },

    '.text-area-container': {
      display: 'block',
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
};
