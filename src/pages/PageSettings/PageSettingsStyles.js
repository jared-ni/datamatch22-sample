export const pageSettingsSx = {
  Box: {
    background: 'white',
    padding: '20px',
    border: '1px solid #f3f3f3',
  },

  '.delete': {
    backgroundColor: '#bb4c4f',
    color: '#fff5f5',
    padding: '2px',
    width: '25px',
    height: '25px',
    opacity: 0,
    outlineColor: '#fff5f5',

    ':hover': {
      opacity: 1,
    },
  },

  '.list-box': {
    background: 'transparent',
    padding: '15px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '400px',

    ':hover': {
      background: '#f4f2f2',
      borderRadius: '3px',
    },

    '#email': {
      fontSize: '16px',
    },
  },

  '.block-btn': {
    marginLeft: '5px',
    height: '40px',
  },

  '.blocklist-input-container': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  '.secondary-links': {
    marginTop: '24px',
  },

  '.blocklist-input': {
    width: '240px',
    height: '40px',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #b1b1b1',
    borderRadius: '4px',
    backgroundColor: '#fff',
  },
};

export const passwordResetSx = {
  input: {
    height: '35px',
    backgroundColor: 'white',
    borderRadius: '3px',
    maxWidth: '300px',
  },
};
