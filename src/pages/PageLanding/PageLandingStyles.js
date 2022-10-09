import { keyframes } from '@emotion/react';

export const pageLandingSx = {
  minHeight: '100%',
  width: '100%',

  '.screen': {
    minHeight: '600px',
    height: '100vh',
    width: '100%',
  },
  '.screen.-first': {
    position: 'relative',
    backgroundColor: '#f8e1dd',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  '.screen.-team': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgb(211, 129, 130)',
  },

  '.screen.-team img': {
    maxWidth: '80%',
    maxHeight: '80%',
    objectFit: 'contain',
  },

  '@media only screen and (max-width: 1000px)': {
    '.screen.-team img': {
      maxWidth: '90%',
      maxHeight: '90%',
      objectFit: 'contain',
    },
  },

  '.screen.-faq': {
    minHeight: '600px',
    height: '100vh',
    width: '100%',
    padding: '2em',
    backgroundColor: 'rgb(242, 192, 189)',
  },

  '.screen.-stats': {
    minHeight: '600px',
    height: '100vh',
    width: '100%',
    background: '#fcd4cc',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    h1: {
      margin: '30px 0',
    },
  },

  '.countdown': {
    display: 'flex',
  },

  '.countdown > .item': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 10px',
    width: '64px',
  },

  '.countdown > .item > .number': {
    fontWeight: 'bold',
    fontSize: '40px',
  },

  '.countdown > .item > .text': {
    fontSize: '16px',
  },

  '.dm-logo': {
    height: '20em',
    marginBottom: '-20px',
  },

  '.dm-text': {
    fontSize: '2.8em',
    letterSpacing: '10px',
    marginLeft: '18px',
  },

  '.faq': {
    width: '100%',
    background: 'white',
    padding: '2em',
    minHeight: '100%',
  },
};

export const MoveUpDown = keyframes`
  0%,
  100% {
    bottom: 0;
  }
  50% {
    bottom: 20px;
  }
`;
