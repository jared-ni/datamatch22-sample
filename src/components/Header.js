/** @jsx jsx */

import { jsx } from 'theme-ui';

const headerSx = {
  '.container': {
    position: 'relative',
    ml: 0,
    minHeight: '3em', // hardcoded, need to modify to fit children
    fontFamily: 'heading',
    fontWeight: 'bold',
    fontSize: 6,
    zIndex: 0,
  },
  '.box': {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    border: theme => `1px solid ${theme.colors.text}`,
    bg: 'lightPink',
    color: 'text',
    p: 3,
  },
  '.underlay': {
    position: 'absolute',
    top: 1,
    left: 1,
    border: theme => `1px solid ${theme.colors.text}`,
    p: 3,
  },
};

const Header = ({ children }) => {
  return (
    <div sx={headerSx}>
      <div className="container">
        <div className="box">{children}</div>
        {/* Redundant so underlay is the same size */}
        <div className="underlay">{children}</div>
      </div>
    </div>
  );
};

export default Header;
