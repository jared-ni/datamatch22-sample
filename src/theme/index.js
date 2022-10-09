export const theme = {
  breakpoints: ['640px', '1024px'],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    default: 'Times New Roman',
    body: 'Apercu, sans-serif',
    heading: 'Apercu, sans-serif',
    monospace: 'Apercu-Mono, monospace',
  },
  fontSizes: [10, 12, 14, 16, 20, 24, 32, 48],
  fontWeights: {
    body: 400,
    medium: 500,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.25,
    heading: 1.125,
  },
  colors: {
    text: '#1F1717',
    primary: '#D7525B',
    secondary: '#BB4C4F',
    background: '#F8F8F8',
    mediumGrey: '#B1B1B1',
    lightGrey: '#E7E7E7',
    offWhite: '#F8F8F8',
    greige: '#F4F2F2',
    red: '#BB4C4F',
    pink: '#D7525B',
    mediumPink: '#EC9697',
    lightPink: '#F5E3E3',
    blue: '#524F6C',
    mediumBlue: '#8E8BAD',
    lightBlue: '#DEDEF0',
  },
  text: {
    heading: {
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
    },
    medium: {
      fontFamily: 'heading',
      lineHeight: 'body',
      fontWeight: 'medium',
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
      overflowWrap: 'break-word',
      fontSize: 3,
    },
    h1: {
      variant: 'text.heading',
      fontSize: 7,
    },
    h2: {
      variant: 'text.heading',
      fontSize: 6,
    },
    h3: {
      variant: 'text.heading',
      fontSize: 5,
    },
    h4: {
      variant: 'text.medium',
      fontSize: 4,
    },
    code: {
      fontFamily: 'monospace',
      fontSize: 'inherit',
    },
  },
  buttons: {
    primary: {
      fontWeight: 'medium',
      color: 'primary',
      bg: 'lightPink',
      border: '1.5px solid',
      br: '3px',
      p: '7px 10px',
      outline: 'none',
      ':active': {
        color: 'white',
        bg: 'primary',
      },
      ':hover': {
        backgroundColor: 'pink',
        color: 'white',
      },
      ':focus': {
        outline: theme => `1px dotted ${theme.colors.primary}`,
      },
    },
    secondary: {
      fontWeight: 'medium',
      color: 'text',
      bg: 'lightGrey',
      border: '1.5px solid',
      br: '3px',
      p: '7px 10px',
      ':focus': {
        outline: theme => `1px dotted ${theme.colors.text}`,
      },
      ':hover': {
        backgroundColor: 'text',
        color: 'white',
      },
    },
    accent: {
      fontWeight: 'medium',
      color: 'white',
      bg: 'primary',
      border: '1.5px solid',
      br: '3px',
      p: '7px 10px',
      ':focus': {
        outline: theme => `1px dotted ${theme.colors.primary}`,
      },
    },
    disabled: {
      fontWeight: 'medium',
      color: 'grey',
      bg: 'lightGrey',
      border: '1.5px solid',
      br: '3px',
      p: '7px 10px',
      ':focus': {
        outline: theme => `1px dotted ${theme.colors.primary}`,
      },
    },
  },
};

export default theme;
