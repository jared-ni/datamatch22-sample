export const dateOptionsSx = {
  '.option-header': {
    display: 'inline-block',
  },
  '.background-border': {
    background: 'white',
    border: theme => `0.5px solid ${theme.colors.mediumGrey}`,
    boxSizing: 'border-box',
    borderRadius: '3px',
    color: theme => `${theme.colors.text}`,
  },
  '.option-input': {
    textAlign: 'left',
    width: '267px',
    height: '33px',
    marginBottom: '3px',
    padding: '1px 10px 1px 10px',
    color: 'black',
    fontSize: '14px',
  },
  '.option-code-input': {
    width: '226px',
  },
  '.option-day-input': {
    display: 'inline-block',
    width: '64px',
    paddingRight: '5px',
  },
  '.option-day-label': {
    marginTop: '5px',
    marginBottom: '-5px',
  },
  '.option-code-input + .option-code-input': {
    marginLeft: '4px',
  },
  '.option-day-input + .option-day-input': {
    marginLeft: '1.33px',
  },
  '.input-separator + .input-separator': {
    marginLeft: '1.33px',
  },
  '.option-select': {
    backgroundImage: `url("${window.location.origin}/angle-down.png")`,
    backgroundPosition: '95% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
  },
  '.option-text-area': {
    textAlign: 'left',
    width: '267px',
    height: '74px',
    color: 'black',
    fontSize: '14px',
  },
  '.text-area-container': {
    display: 'inline-block',
  },
  '.logo-upload': {
    float: 'left',
    marginRight: '10px',
  },
  '.remove-option': {
    fontSize: '14px',
    float: 'right',
  },
  '.date-option': {
    width: '482px',
    border: theme => `1px solid ${theme.colors.text}`,
    borderRadius: '6px',
    bg: 'lightPink',
    color: 'text',
    padding: '10px',
    paddingBottom: '7px',
    marginBottom: '10px',
    fontSize: '14px',
  },
  '.file-upload': {
    border: 'none',
  },
  '.accent-select': {
    marginTop: '5px',
    marginBottom: '32px',
    display: 'inline-block',
    textAlign: 'left',
    color: theme => `${theme.colors.primary}`,
    bg: 'lightPink',
    border: `1.5px solid`,
    borderRadius: '4px',
    fontWeight: '500',
    padding: '7px 10px',
    paddingRight: '35px',
    height: 'auto',
    width: '224px',
  },
  '.accent-select:hover': {
    bg: theme => `${theme.colors.pink}`,
    color: 'white',
  },
  '.accent-select:not(:disabled)': {
    cursor: 'pointer',
  },
  '.error-message': {
    marginBottom: '5px',
    color: 'red',
    textAlign: 'left',
  },

  // for mobile devices
  '@media only screen and (max-width: 768px)': {
    '.option-header': {
      marginTop: '4px',
      marginBottom: '8px',
    },
    '.logo-upload': {
      float: 'none',
      textAlign: 'center',
      marginRight: '0px',
    },
    '.option-input': {
      display: 'block',
      marginRight: 'auto',
      marginLeft: 'auto',
    },
    '.option-code-input': {
      width: '267px',
    },
    '.option-day-input': {
      width: '88px',
      display: 'inline-block',
    },
    '.option-code-input + .option-code-input': {
      marginLeft: 'auto',
    },
    '.input-separator': {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '267px',
    },
    '.input-separator + .input-separator': {
      marginLeft: 'auto',
    },
    '.text-area-container': {
      display: 'block',
    },
    '.option-text-area': {
      display: 'block',
      marginRight: 'auto',
      marginLeft: 'auto',
      marginBottom: '3px',
    },
    '.date-option': {
      width: 'auto',
    },
  },

  '.modal-container': {
    textAlign: 'center',
    padding: '40px',
  },
  '.modal-question': {
    fontSize: '22px',
    marginBottom: '20px',
  },
  '.modal-cancel': {
    cursor: 'pointer',
  },
};
