/** @jsx jsx */

import { jsx } from 'theme-ui';

const defaultWidth = '720px';
const defaultMargin = '20px';

// Wrapper around content to enforce a maximum width
// Centered by default, but can change by setting align: left
const Container = ({ align, children, margin, maxWidth, style }) => {
  return (
    <div
      sx={{
        m: margin || defaultMargin,
        pt: [0, '30px'],
        ...style,
      }}
    >
      <div
        sx={{
          maxWidth: ['100%', maxWidth || defaultWidth],
          margin: align !== 'left' && '0 auto',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
