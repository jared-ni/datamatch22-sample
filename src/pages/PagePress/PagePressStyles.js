export const pagePressSx = {
  backgroundColor: theme => theme.colors.background,

  '.article-row': {
    minHeight: 200,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1em',
    flexWrap: 'wrap',
  },

  '.article-row:hover': {
    backgroundColor: theme => theme.colors.lightPink,
  },

  '.article-title': {
    fontWeight: '400 !important',
    color: '#000 !important',
    fontSize: '1.5em',
    textAlign: 'right',
    width: ['90%', 300],
  },
  '.articles-container': {
    display: 'flex',
    flexDirection: 'column',
  },
  '.article-image': {
    maxWidth: '100%',
    maxHeight: '100%',
    margin: '1em 2em',
  },
  '.article-image-container': {
    width: 300,
    display: 'flex',
    justifyContent: 'center',
  },

  'a:hover, a:visited, a:link, a:active': {
    textDecoration: 'none',
  },
};
