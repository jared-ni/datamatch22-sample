/** @jsx jsx */

import { jsx } from 'theme-ui';
import { Link as RouterLink } from 'react-router-dom';

// Adds sx styling to the Link component
// Default styles: bold, primary, secondary on hover
// To change <a> styles as well as <Link> styles, edit pageContentSx in PageApp
export default function Link(props) {
  return (
    <RouterLink
      {...props}
      sx={{
        fontWeight: props.fontWeight || 'bold',
        color: props.color || 'primary',
        ':hover': {
          color: props.hoverColor || 'secondary',
        },
      }}
    />
  );
}
