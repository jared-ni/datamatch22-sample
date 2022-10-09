// populates the correct continue URL domain for emails (depending on dev/staging/production environment)
const emailDomain =
  process.env.REACT_APP_REAL_SITE || process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT
    : process.env.REACT_APP_CONFIRMATION_EMAIL_STAGE;

export default emailDomain;
