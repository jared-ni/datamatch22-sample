/** @jsx jsx */

import { jsx } from 'theme-ui';
import ReactTags from 'react-tag-autocomplete';

const pronounSelectSx = {
  '.react-tags': {
    position: 'relative',
    padding: '0px 0px 0px 6px',
    border: theme => `0.5px solid ${theme.colors.mediumGrey}`,
    boxSizing: 'border-box',
    borderRadius: '3px',

    /* clicking anywhere will focus the input */
    cursor: 'text',

    width: '353px',
    height: '100%',
    background: 'white',
  },

  '.react-tags__selected': {
    display: 'inline',
  },

  '.react-tags__selected-tag': {
    display: 'inline-block',
    boxSizing: 'border-box',
    margin: '5px 4px 0px 0',
    padding: '5px 6px 4px 6px',
    border: 'none',
    borderRadius: '3px',
    background: theme => `${theme.colors.lightPink}`,
    fontSize: '10px',
  },

  '.react-tags__selected-tag:after': {
    content: '"\\2715"',
    color: 'black',
    marginLeft: '8px',
  },

  '.react-tags__select-tag-name': {
    marginBottom: '1px',
  },

  '.react-tags__search': {
    display: 'inline-block',

    /* match tag layout */
    padding: '0px',
    marginBottom: '6px',

    /* prevent autoresize overflowing the container */
    maxWidth: '100%',
  },

  '@media screen and (min-width: 30em)': {
    '.react-tags__search': {
      /* this will become the offsetParent for suggestions */
      position: 'relative',
    },
  },

  '.react-tags__search-input': {
    width: '123px !important', // override width from element.style
    height: '27px !important',
    padding: '3px 0px 3px 4px',
    fontSize: '14px',

    /* prevent autoresize overflowing the container */
    maxWidth: '100%',

    /* remove styles and layout from this element */
    margin: '0',
    border: '0',
    outline: 'none',
  },

  '.react-tags__search-input::-ms-clear': {
    display: 'none',
  },

  '.react-tags__suggestions': {
    position: 'absolute',
    top: '100%',
    left: '0',
    width: '100%',
  },

  // '@media screen and (min-width: 30em)': {
  //   '.react-tags__suggestions': {
  //     width: '240px',
  //   },
  // },

  '.react-tags__suggestions ul': {
    margin: '4px -1px',
    padding: '0',
    listStyle: 'none',
    background: 'white',
    border: '1px solid #D1D1D1',
    borderRadius: '2px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  },

  '.react-tags__suggestions li': {
    borderBottom: '1px solid #ddd',
    padding: '6px 8px',
  },

  '.react-tags__suggestions li mark': {
    textDecoration: 'underline',
    background: 'none',
    fontWeight: '600',
  },

  '.react-tags__suggestions li:hover': {
    cursor: 'pointer',
    background: '#eee',
  },

  '.react-tags__suggestions li.is-active': {
    background: '#b7cfe0',
  },

  '.react-tags__suggestions li.is-disabled': {
    opacity: '0.5',
    cursor: 'auto',
  },
};

// reference: https://github.com/i-like-robots/react-tags#readme
const PronounSelect = ({
  onAddition,
  onDelete,
  overflow,
  placeholderText,
  suggestions,
  tags,
}) => {
  return (
    // overflow changes height of div so textbox expands as needed
    <div
      sx={pronounSelectSx}
      style={{
        height: overflow ? 55 : 33,
      }}
    >
      <ReactTags
        onAddition={onAddition}
        onDelete={onDelete}
        placeholderText={placeholderText}
        suggestions={suggestions}
        tags={tags}
      />
    </div>
  );
};

export default PronounSelect;
