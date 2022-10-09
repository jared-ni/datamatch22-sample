import { keyframes } from '@emotion/react';
import { footerHeight, headerHeight } from 'constants/Navbar';

export const pageMainSx = {
  minHeight: '100%',
  width: '100%',

  '.screen': {
    minHeight: '600px',
    height: '100vh',
    width: '100%',
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

  '.links': {
    position: 'fixed',
    bottom: '0px',
    textAlign: 'center',
    width: '100%',
    background: 'white',
    padding: '15px',
    zIndex: 3,
    boxShadow: '0px -1px 4px rgba(0, 0, 0, 0.25)',
  },

  '.button': {
    marginLeft: '30px',
  },

  '@media only screen and (max-width: 1000px)': {
    '.screen.-team img': {
      maxWidth: '90%',
      maxHeight: '90%',
      objectFit: 'contain',
    },
  },

  '.screen.-faq': {
    height: 'auto',
    minGeight: 'calc(100vh - 70px)',
    padding: '2em',
    backgroundColor: '#fff',
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

  '.screen.-map': {
    height: 'calc(100vh - 70px)',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },

  '.all-schools-map': {
    width: '80vw',
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

export const liveLandingSx = {
  '.landingContainer': {
    height: `calc(100vh - ${headerHeight + footerHeight}px)`,
    overflowY: 'hidden',
  },
  '.headlineContainer': {
    height: `calc(100vh - ${headerHeight + footerHeight}px)`,

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  '.headline': {
    fontSize: '140px',
    fontWeight: 600,
    lineHeight: 0.8,
  },
  '.subline': {
    fontSize: '30px',
    fontWeight: 400,
  },
  '.mobileHeadlineContainer': {
    zIndex: 100,
    textAlign: 'center',
  },
  '.mobileHeadline': {
    fontSize: '60px',
    fontWeight: 600,
    lineHeight: 0.8,
  },
  '.mobileSubline': {
    fontSize: '16px',
    fontWeight: 400,
  },
  '.emblemContainer': {
    height: `calc(100vh - ${headerHeight + footerHeight}px)`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  '.mobileEmblemContainer': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    height: '360px',
    padding: '40px 0',
    boxSizing: 'border-box',
  },
  '.emblem': {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '300px',
  },
  '.emblem img': {
    position: 'absolute',
  },
  '.logoCircle': {
    transition: 'transform .8s ease-in-out',
    WebkitTransition: '-webkit-transform .8s ease-in-out',
  },
  '.logoCircle:hover': {
    transform: 'rotate(360deg)',
    WebkitTransform: 'rotate(360deg)',
    cursor: 'pointer',
  },
  '.chatContainer': {
    height: `calc(100vh - ${headerHeight + footerHeight}px)`,

    display: 'flex',
  },
  '.mobileChatContainer': {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: '80%',
    maxWidth: '500px',
    height: `calc(100vh - ${headerHeight + footerHeight + 360}px)`,
    WebkitMaskImage: 'linear-gradient(to top, black 50%, transparent 100%)',
    maskImage: 'linear-gradient(to top, black 50%, transparent 100%)',
  },

  '.circleBg': {
    position: 'absolute',
    backgroundColor: theme => theme.colors.lightPink,
    borderRadius: '100%',
    width: '250px',
    height: '250px',
  },
  '.popup': {
    position: 'absolute',
    transition: 'all 1s ease-in-out',
    opacity: 0,
    cursor: 'pointer',
  },
  '.popup-active': {
    opacity: 1,
    transform: 'translate(60px, -200px)',
  },
};

export const chatHeights = {
  height: 80,
  marginTop: 12,
};

export const landingChatSx = {
  marginTop: '-15px',
  height: '100%',
  flex: 1,
  overflowY: 'hidden',
  '.messageContainer': {
    border: theme => `1px solid ${theme.colors.mediumGrey}`,
    borderRadius: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: `${chatHeights.marginTop}px 0`,
    width: ['300px', 'fit-content'],
    maxWidth: ['300px', '400px'],
    padding: '10px',
    overflowWrap: 'break-word',
  },
  '.messageLink': {
    color: theme => theme.colors.blue,
  },
};
