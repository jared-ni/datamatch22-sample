export const pageSurveySx = {
  '.radio': {
    borderRadius: '50%',
    border: '2px solid #000000',
    width: '20px',
    height: '20px',
    background: 'lightGrey',
    marginRight: '11px',
    marginTop: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },

  '.radio-inside': {
    borderRadius: '50%',
    width: '12px',
    height: '12px',
    background: '#323232',
  },

  '.answer': {
    padding: '10px 10px',
    height: 'auto',
    textAlign: 'left',
    display: 'flex',
    flexWrap: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    ':hover': {
      background: theme => theme.colors.greige,
    },
  },

  '.answer-text': {
    wordBreak: 'break-word',
    maxWidth: 'calc(100% - 40px)',
  },

  '.answer-text p': {
    fontWeight: 400,
    color: '#222222',
  },

  '.answer-selected': {
    background: theme => theme.colors.greige,
  },

  '.question': {
    marginBottom: '15px',
  },

  '.checkmark': {
    marginRight: '4px',
  },

  '.profile-button': {
    backgroundColor: '#f4f2f2',
    padding: '50px',
    textAlign: 'left',
    fontSize: '18px',
    display: 'inline-block',
  },

  '.left-div': {
    width: '60%',
    float: 'left',
  },

  '.right-div': {
    width: '40%',
    float: 'right',
    marginTop: '-8px',
    paddingLeft: '20px',
  },

  '.incomplete-message': {
    color: '#D7525B',
  },
};

export const surveyModalSx = {
  '.modal-container': {
    textAlign: 'left',
    padding: '40px',
  },

  '.modal-question': {
    fontSize: '22px',
  },

  '.modal-cancel': {
    cursor: 'pointer',
  },

  '.close-button': {
    padding: '10px',
    marginBottom: '-45px',
    cursor: 'pointer',
  },

  '.left-div': {
    width: '60%',
    float: 'left',
  },

  '.right-div': {
    width: '40%',
    float: 'right',
    marginTop: '-10px',
    paddingLeft: '20px',
  },
};
