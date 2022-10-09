export const pageResultsSx = {
  paddingLeft: '15%',
  paddingRight: '15%',
  paddingTop: '10%',

  '.matchesSidebar': {
    position: 'fixed',
    width: '160px',
    right: '5%',
    top: '40%',
  },

  '.mobileHeader': {
    display: 'none',
  },

  '.desktopHeader': {
    display: 'inline-block',
  },

  '.desktop-flexContainer': {
    display: 'flex',
  },

  '.desktop-fixed': {
    paddingRight: '150px',
  },

  '.flex-item': {
    flexGrow: 1,
  },

  '.matchesList': {
    maxWidth: '450px',
    margin: 'auto',
  },

  '.header-description': {
    fontSize: '24px',
    lineHeight: '29px',
    marginBottom: '10px',
  },

  '.header-text': {
    marginBottom: '10px',
    zoom: '0.95',
    background: 'rgba(249, 169, 165, 0.5)',
    padding: '10px',
  },

  'mobile-matches': {
    display: 'none',
  },

  '.mobile-matchesList': {
    display: 'none',
  },

  '@media (max-width: 1150px)': {
    '.matchesList': {
      maxWidth: '350px',
    },

    '.matchesSidebar': {
      width: '120px',
      fontSize: '14px',
    },
  },

  '@media (max-width: 900px)': {
    '.matchesList': {
      maxWidth: '300px',
    },

    '.matchesSidebar': {
      right: '16px',
      width: '120px',
      fontSize: '14px',
    },
  },

  '@media (max-width: 700px)': {
    paddingLeft: '5%',
    paddingRight: '5%',

    '.desktop-flexContainer': {
      display: 'none',
    },

    '.matchesSidebar': {
      display: 'none',
    },

    '.mobileHeader': {
      display: 'inline-block',
    },

    '.matchesList': {
      display: 'none',
    },

    '.mobile-matchesList': {
      display: 'inline',
      width: '100%',
      margin: '0 auto',
    },
  },
};
