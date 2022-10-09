// TODO: figure out a way for longer emails not to overflow suggestion box(prob just needs overflow: hidden or smth)
export const pageRouletteSx = {
  overflowX: 'auto',

  h1: {
    fontSize: '1.7em',
  },

  h5: {
    maxWidth: '8em',
  },

  '.mobile-top-text': {
    paddingTop: '1em',
    paddingBottom: '1em',
    maxWidth: '311px',
    textAlign: 'left',
  },

  '.top-text': {
    maxWidth: '35em',
    paddingLeft: '3em',
  },

  form: {
    margin: '0px auto',
  },

  '.header': {
    marginTop: '2em',
  },

  '.header-content': {
    display: 'flex',
    flexDirection: 'row',
  },

  '.heading-div': {
    width: '17rem',
  },

  '.main': {
    paddingTop: '4rem',
    paddingBottom: '4rem',
  },

  '.center': {
    textAlign: 'center',
    position: 'relative',
    width: '100%',
    margin: '0px auto',
  },

  '.center-block': {
    display: 'block',
    margin: '0px auto',
  },

  '.heart': {
    position: 'relative',
    zIndex: 0,
  },

  '.form': {
    textAlign: 'center',
  },

  '.form-container': {
    justifyContent: 'center',
    textAlign: 'center',
    padding: '12rem 5rem 0',
  },

  '.main-container': {
    justifyContent: 'center',
    textAlign: 'center',
    width: '46rem',
    height: '26rem',
    position: 'relative',
    backgroundColor: '#EC9697',
  },

  '.envelope': {
    position: 'absolute',
    borderTop: '13rem solid transparent',
    borderLeft: '23rem solid #EC9697',
    borderBottom: '13rem solid #EC9697',
    borderRight: '23rem solid rgb(206, 120, 121)',
    borderRadius: '6px',
    zIndex: '9',
    pointerEvents: 'none',
  },

  '.flip': {
    position: 'absolute',
    borderTop: '13rem solid #D7525B',
    borderLeft: '23rem solid transparent',
    borderBottom: '13rem solid transparent',
    borderRight: '23rem solid transparent',
    borderRadius: '6px',
  },

  '.letter': {
    position: 'absolute',
    background: 'white',
    border: '0.5px solid black',
    borderradius: '6px',
    padding: '2rem 5rem 7rem',
    zIndex: '5',
    width: '45rem',
    height: '25rem',
    left: '8px',
  },

  '.open': {
    transform: 'rotateX(0deg)',
    transformOrigin: 'center top',
    animation: ' flipOpen 0.4s ease-in forwards',
  },

  '.closed': {
    transform: 'rotateX(180deg)',
    transformOrigin: 'center top',
    animation: 'flipClose 0.4s ease-in forwards',
    animationDelay: '0.5s',
  },

  '.letterOpen': {
    top: '0rem',
    animation: 'slideUp 0.5s ease-in forwards',
    animationDelay: '0.5s',
  },

  '.letterClose': {
    top: '-12rem',
    animation: 'slideDown 0.5s ease-in forwards',
  },

  '.not-registered-container': {
    position: 'relative',
    top: '-10rem',
    maxWidth: '11rem',
  },

  '.not-registered': {
    marginBottom: '15px',
    color: '#dc143c',
  },

  '.not-registered-mobile': {
    marginTop: '-42px',
    marginBottom: '5px',
    color: '#dc143c',
  },

  '.not-registered-mobile2': {
    marginTop: '-73px',
    marginBottom: '5px',
    color: '#dc143c',
  },

  '.error-message': {
    margin: '0 auto',
    textAlign: 'center',
    color: '#dc143c',
    width: '55%',
  },

  '.error-message-mobile': {
    margin: '0 auto',
    marginTop: '-30px',
    marginBottom: '25px',
    textAlign: 'center',
    color: '#dc143c',
    width: '90%',
  },

  '.outline': {
    zIndex: -1,
    width: '100%',
  },

  '.mobile-form': {
    display: 'flex',
    flexDirection: 'column',
    width: '15em',
    justifyContent: 'left',
    textAlign: 'left',
  },

  '.img-instruction-mobile': {
    width: '100px',
    maxwidth: '90vw',
    margin: '10px 0px 10px 0px',
  },

  '.img-instruction': {
    width: '100%',
    maxwidth: '90vw',
    margin: '10px 0px 10px 0px',
  },

  '.instructions': {
    paddingLeft: '10%',
    paddingRight: '10%',
  },

  '.letter-content': {
    display: 'flex',
    flexDirection: 'row',
    padding: '0 3rem 0',
  },

  '.input1': {
    position: 'relative',
    textAlign: 'center',
    flexGrow: '1',
    maxWidth: '8em',
  },

  '.heart-txt': {
    position: 'relative',
    zIndex: '9',
    flexGrow: '1',
  },

  '.submit-button': {
    position: 'relative',
    top: '8rem',
  },

  '.input2': {
    position: 'relative',
    flexGrow: '1',
    flexDirection: 'column',
    maxWidth: '8em',
  },

  '.email-auto': {
    position: 'absolute',
  },

  'submit-div': {
    marginTop: '2rem',
  },

  button: {
    width: '178px',
    height: '47px',
    marginBottom: '10px',
  },

  '.mobile-buttons': {
    maxWidth: '311px',
    marginBottom: '2em',
  },

  '.top-bot-padding': {
    paddingTop: '40px',
    paddingBottom: '1em',
  },

  '.padding': {
    padding: '1em',
    marginTop: '-4em',
  },

  '.crush-submitted': {
    position: 'absolute',
    textAlign: 'center',
    maxWidth: '22em',
    zIndex: 5,
    marginTop: '-12em',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    color: '#D9565D',
    backgroundColor: '#F5E3E3',
    border: '1px solid #D9565D',
    padding: '0.5rem 3rem',
    opacity: '0%',
    animation: 'fadeIn 0.4s ease-in forwards',
    animationDelay: '1s',
  },

  '.tblpic': {
    width: '18em',
    height: 'auto',
    verticalAlign: 'bottom',
    marginBottom: '-3em',
  },

  '.person-pic': {
    width: '0.6em',
    height: 'auto',
  },

  '.first-pic': {
    width: '6em',
    height: 'auto',
  },

  'img.resize': {
    width: '10em',
    height: 'auto',
  },

  '.heart-padding': {
    paddingRight: '1em',
  },

  'img.resize-heart': {
    width: '3em',
    height: 'auto',
  },

  table: {
    border: '0px solid black',
  },

  tr: {
    border: '0px solid black',
  },

  th: {
    border: '0px solid black',
    textAlign: 'left',
    paddingLeft: '3em',
  },

  td: {
    border: '0px solid black',
    paddingLeft: '3em',
    verticalAlign: 'top',
    textAlign: 'left',
  },

  '.mobile-bottom-text': {
    padding: '2em',
    paddingLeft: '0em',
    maxWidth: '20em',
    margin: '0px auto',
  },

  '.mobile-name-banner': {
    textAlign: 'left',
    backgroundColor: '#ec9697',
    width: '200%',
    transform: 'translate(-25%, 0%)',
    color: 'white',
    paddingTop: '2em',
    paddingBottom: '2em',
  },

  '.container': {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 2,
  },

  '.input-container': {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'center',
  },

  '.crush-roulette-input': {
    width: '220px',
    height: '40px',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #b1b1b1',
    borderRadius: '4px',
    backgroundColor: '#fff',
  },

  '.left-align': {
    textAlign: 'left',
  },
};
