/** @jsx jsx */

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import { jsx, Button, Grid } from 'theme-ui';
import { college_to_email } from 'constants/config.json';
import { Mixpanel } from 'utils/mixpanel';

import Container from 'components/Container';
import Header from 'components/Header';
import Loading from 'components/Loading';
import Input from 'components/Input';
import Link from 'components/Link';

import heart1 from 'assets/logo-heart.svg';
// import heart2 from 'assets/rouletteHeartRed.svg';
import outline from 'assets/rouletteOutline.svg';
import roulette1 from 'assets/roulette1.png';
import roulette2 from 'assets/roulette2.png';
import roulette3 from 'assets/roulette3.png';

import { pageRouletteSx } from 'pages/PageRoulette/PageRouletteStyles';

class PageRoulette extends React.Component {
  constructor(props) {
    super(props);
    this.state = { width: window.innerWidth };
  }

  // Update window width when user resizes window
  componentDidMount() {
    // Web analytics
    Mixpanel.track('Roulette_Page', {});
    window.addEventListener('resize', this.handleWindowSizeChange);
    this.setState({ width: window.innerWidth });
    this.updateNames();
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  async componentDidUpdate(prevProps) {
    // If the crush has changed re-render the names
    if (prevProps.crush !== this.props.crush) {
      this.updateNames();
    }
  }

  // If the input box is an email box, converts all uppercase characters to lowercase
  handleChange = event => {
    if (event.target.name === 'email1' || event.target.name === 'email2') {
      // If typing in email input box, convert all input to lowercase and hide send email messages
      let update = {
        [event.target.name]: event.target.value,
        showErrorMessage: false,
        showSendEmail1: false,
        showSendEmail2: false,
      };

      // Clear lookup name value when email is updated to check for user when it is submitted
      if (event.target.name === 'email1') {
        update.lookupName1 = null;
      } else {
        update.lookupName2 = null;
      }

      this.setState(update);
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  showErrorMessage = message => {
    this.setState({
      errorMessage: message,
      loading: false,
      showErrorMessage: true,
    });
  };

  // Called when user submits their crush
  submitCrush = async event => {
    event.preventDefault();

    // Clear send email name inputs when user submits crush
    this.setState({ loading: true, nameEmailInput1: '', nameEmailInput2: '' });
    const { email1, email2 } = this.state;

    if (!email1 || !email2) {
      return this.showErrorMessage('Email field(s) cannot be blank.');
    }

    // Check if both emails are formatted correctly
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const email1Invalid = !email1.match(regex);
    const email2Invalid = !email2.match(regex);
    if (email1Invalid && email2Invalid) {
      return this.showErrorMessage(
        `${email1} and ${email2} are not valid email addresses.`,
      );
    } else if (email1Invalid) {
      return this.showErrorMessage(`${email1} is not a valid email address.`);
    } else if (email2Invalid) {
      return this.showErrorMessage(`${email2} is not a valid email address.`);
    }

    // Check if both email domains are valid colleges in database
    const email1NotFound = !Object.keys(college_to_email).find(school =>
      college_to_email[school].includes(
        email1
          .substring(email1.lastIndexOf('@') + 1, email1.length)
          .toLowerCase(),
      ),
    );
    const email2NotFound = !Object.keys(college_to_email).find(school =>
      college_to_email[school].includes(
        email2
          .substring(email2.lastIndexOf('@') + 1, email2.length)
          .toLowerCase(),
      ),
    );
    if (email1NotFound && email2NotFound) {
      return this.showErrorMessage(
        `Uh oh! ${email1} and ${email2} are not recognized college emails.`,
      );
    } else if (email1NotFound) {
      return this.showErrorMessage(
        `Uh oh! ${email1} is not a recognized college email.`,
      );
    } else if (email2NotFound) {
      return this.showErrorMessage(
        `Uh oh! ${email2} is not a recognized college email.`,
      );
    }

    // Can't submit a reflexive crush
    if (email1.toLowerCase() === email2.toLowerCase()) {
      return this.showErrorMessage(
        <React.Fragment>
          We're all for self-love, however The Algorithm&trade; won't know how
          to handle a crush with the same person.
        </React.Fragment>,
      );
    }

    // Lookup both users for name only if they don't already have a name associated with them
    this.setState(
      {
        lookupName1: this.state.lookupName1 || (await this.lookupName(email1)),
        lookupName2: this.state.lookupName2 || (await this.lookupName(email2)),
      },
      () => this.validateUsers(),
    );

    this.setState({
      envelopeClass: 'flip closed',
      letterClass: 'letter letterClosed',
    });
  };

  // Handles displaying send email prompt if either of the users don't have accounts yet
  validateUsers = () => {
    // If either name not set (user not found), prompt for that name
    if (!this.state.lookupName1 || !this.state.lookupName2) {
      this.setState({
        loading: false,
        showSendEmail1: !this.state.lookupName1,
        showSendEmail2: !this.state.lookupName2,
      });
    } else {
      // If both names set, update the database
      const updates = {
        email1: this.state.email1.toLowerCase(),
        email2: this.state.email2.toLowerCase(),
      };

      const onUpdate = () => {
        // Web analytics
        Mixpanel.track('Crush_Set', {});
        this.setState({
          loading: false,
          showSendEmail1: false,
          showSendEmail2: false,
          showErrorMessage: false,
        });
      };
      this.props.firebase.set(`/crushes/${this.props.uid}`, updates, onUpdate);
      this.props.updateNotifications(true);
    }
  };

  // Handles user submitting a name to the send email input
  emailSubmit = isUser1 => {
    let update = {};
    if (isUser1) {
      this.setState({ nameInputLoading1: true });
      const { nameEmailInput1 } = this.state;

      this.props.firebase
        .functions()
        .httpsCallable('email-inviteCrushRoulette')({
        invitedUserEmail: this.state.email1.toLowerCase(),
        invitedUserName: nameEmailInput1,
      });

      update = {
        lookupName1: nameEmailInput1,
        nameInputLoading1: false,
        showSendEmail1: false,
      };
    } else {
      this.setState({ nameInputLoading2: true });
      const { nameEmailInput2 } = this.state;

      this.props.firebase
        .functions()
        .httpsCallable('email-inviteCrushRoulette')({
        invitedUserEmail: this.state.email2.toLowerCase(),
        invitedUserName: nameEmailInput2,
      });

      update = {
        lookupName2: nameEmailInput2,
        nameInputLoading2: false,
        showSendEmail2: false,
      };
    }
    this.setState(update, () => this.validateUsers());
  };

  // Called when remove crush button is pressed
  removeCrush = () => {
    this.setState({ loading: true });

    const onUpdate = () => {
      // Web analytics
      Mixpanel.track('Crush_Remove', {});
      this.setState({ loading: false });
    };

    // Set user's crush node to null
    this.props.firebase.set(`/crushes/${this.props.uid}`, null, onUpdate);
    this.props.updateNotifications(null);
  };

  // Retrieves the name corresponding to the given email
  lookupName = async email => {
    return (
      await this.props.firebase
        .database()
        .ref('emailToName')
        .child(email.replace(/\./g, ','))
        .once('value')
    ).val();
  };

  // Updates the state and retrieves the crush names from the database
  updateNames = async () => {
    // When crush is updated, clear all inputs and error messages
    let updates = {
      email1: '',
      email2: '',
      loaded: true,
      nameEmailInput1: '',
      nameEmailInput2: '',
      showErrorMessage: false,
      showSendEmail1: false,
      showSendEmail2: false,
    };

    if (this.props.crush) {
      // If crush is set, load emails & names from database
      const { email1, email2 } = this.props.crush;

      const name1 =
        (await this.lookupName(email1)) ||
        email1.substring(0, email1.lastIndexOf('@'));
      const name2 =
        (await this.lookupName(email2)) ||
        email2.substring(0, email2.lastIndexOf('@'));

      updates.email1 = email1;
      updates.email2 = email2;
      updates.name1 = name1;
      updates.name2 = name2;
    }
    this.setState(updates);
  };

  renderInstructions = responsiveClass => {
    // responsiveClass will be passed in the class attribute of the images - either "img-instruction" or "img-instruction-mobile"
    const instructions = [
      {
        src: roulette1,
        description:
          'You get to choose two people who you think should match and get to ' +
          'know each other. Could be you, could be your friends, could be ' +
          'your friend’s roommate’s goldfish... Search their email and choose wisely!',
      },
      {
        src: roulette2,
        description:
          'Can’t find the person you’re looking for? We’ll send them an email ' +
          'telling them that someone wants them to sign up for Datamatch ;) ' +
          '(completely anonymously of course)!',
      },
      {
        src: roulette3,
        description: (
          <Fragment>
            We know that there may be some people you don’t want to match with.
            If you’d like to explicitly list those people, head over to the{' '}
            <Link to="/app/settings">
              <b>BLOCKLIST!</b>
            </Link>{' '}
            We’re here to listen and help.
          </Fragment>
        ),
      },
    ];

    return instructions.map(({ description, src }, i) => {
      return (
        <div key={i} className="center">
          <img className={responsiveClass} src={src} alt="tbl placeholder" />
          <div className="left-align">{description}</div>
          <br />
        </div>
      );
    });
  };

  // Helper function for rendering buttons
  renderButton = (text, onClick, additionalDisabledCondition) => {
    const disabled = this.state.loading || additionalDisabledCondition;
    return (
      <Button
        disabled={disabled}
        onClick={onClick}
        variant={disabled ? 'disabled' : 'primary'}
      >
        {this.state.loading ? <Loading size="40px" color="grey" /> : text}
      </Button>
    );
  };

  renderDesktopInput = () => {};

  render() {
    const {
      email1,
      email2,
      errorMessage,
      loaded,
      nameEmailInput1,
      nameEmailInput2,
      nameInputLoading1,
      nameInputLoading2,
      name1,
      name2,
      showErrorMessage,
      showSendEmail1,
      showSendEmail2,
      width,
    } = this.state;
    const { crush, status } = this.props;
    if (!loaded) {
      return (
        <div style={{ height: 300 }}>
          <Loading color="black" />
        </div>
      );
    }

    const crushData = isEmpty(crush) ? (
      <div className="crush"></div>
    ) : (
      <div className="crush-submitted">
        <style>
          {`
          @keyframes fadeIn {
            0% {
              opacity: 0%;
            }

            100% {
              opacity: 100%;
            }
          }`}
        </style>
        <h1>
          <b>
            {name1} & {name2}
          </b>
        </h1>
        <div style={{ height: '0em' }}></div>
        <h6>Match submitted successfully!</h6>
      </div>
    );

    // True after survey has closed, disabling crush buttons to prevent changes
    const surveyClosed =
      status === 'live-processing' || status === 'live-matches';

    const isMobile = width <= 1100;
    // Renders the page content when viewing a small screen
    const renderMobile = () => {
      return (
        <div sx={pageRouletteSx} style={{ padding: '2em', paddingTop: '0em' }}>
          <div className="header">
            {' '}
            {/*style={{ marginLeft: '3em' }}>*/}
            <Header>Crush Roulette</Header>
          </div>
          {isEmpty(crush) ? (
            <p className="mobile-top-text">
              Submit two people and we'll give them a slightly higher chance of
              being matched by The Algorithm&trade;. If gender preferences work
              out, the couple will match to love; else, they'll match as
              friends! You only get one pair (although you can change or remove
              it anytime), so choose wisely...
            </p>
          ) : (
            <div className="mobile-name-banner">
              <div style={{ paddingLeft: '25%' }}>
                <h1>
                  <b>
                    {name1} & {name2}
                  </b>
                </h1>
                <h6>Match submitted successfully</h6>
                <h6>It's all up to The Algorithm&trade; now...</h6>
              </div>
            </div>
          )}
          <div className="mobile-form">
            <div className="top-bot-padding">
              <p>Person 1:</p>
              <div
                style={{
                  position: 'relative',
                  height: '3.5em',
                  width: '9em',
                }}
              >
                <div className="email-auto">
                  <Input
                    type="email"
                    className="crush-roulette-input"
                    name="email1"
                    placeholder="Type an email"
                    value={email1}
                    handleInputChange={this.handleChange}
                  />
                </div>
              </div>
              <div
                hidden={!showSendEmail1}
                style={{ textAlign: 'center', marginTop: '2.5em' }}
              >
                <p className="not-registered-mobile">
                  {email1} has not signed up for Datamatch. Enter their name
                  below to send them an email.
                </p>
                <Input
                  handleInputChange={this.handleChange}
                  name="nameEmailInput1"
                  placeholder="Name"
                  type="text"
                  value={nameEmailInput1}
                />
                <br />
                <Button
                  disabled={nameInputLoading1}
                  onClick={() => this.emailSubmit(true)}
                >
                  Send Email
                </Button>
              </div>
            </div>
            <div>
              <p>Person 2:</p>
              <div
                style={{
                  position: 'relative',
                  height: '5.5em',
                  width: '9em',
                }}
              >
                <div className="email-auto">
                  <Input
                    type="email"
                    className="crush-roulette-input"
                    name="email2"
                    placeholder="Type an email"
                    value={email2}
                    handleInputChange={this.handleChange}
                  />
                </div>
              </div>
              <div hidden={!showSendEmail2} style={{ marginTop: '2.5em' }}>
                <p className="not-registered-mobile2">
                  {email2} has not signed up for Datamatch. Enter their name
                  below to send them an email.
                </p>
                <Input
                  handleInputChange={this.handleChange}
                  name="nameEmailInput2"
                  placeholder="Name"
                  type="text"
                  value={nameEmailInput2}
                />
                <br />
                <Button
                  disabled={nameInputLoading2}
                  onClick={() => this.emailSubmit(false)}
                >
                  Send Email
                </Button>
              </div>
              <div className="mobile-buttons">
                {isEmpty(crush) ? (
                  this.renderButton(
                    <React.Fragment>Submit Crush</React.Fragment>,
                    this.submitCrush,
                    surveyClosed || showSendEmail1 || showSendEmail2,
                  )
                ) : (
                  <React.Fragment>
                    {this.renderButton(
                      <React.Fragment>Update Crush</React.Fragment>,
                      this.submitCrush,
                      (email1 === crush.email1 && email2 === crush.email2) ||
                        surveyClosed ||
                        showSendEmail1 ||
                        showSendEmail2,
                    )}
                    <br />
                    {this.renderButton(
                      <React.Fragment>Remove Crush</React.Fragment>,
                      this.removeCrush,
                      surveyClosed,
                    )}
                  </React.Fragment>
                )}
              </div>
              <p className="error-message-mobile" hidden={!showErrorMessage}>
                {errorMessage}
              </p>
            </div>
          </div>
          {this.renderInstructions('img-instruction-mobile')}
        </div>
      );
    };

    // Renders the page content when viewing a large screen
    const renderDesktop = () => {
      return (
        <Container maxWidth={'1300px'}>
          <div sx={pageRouletteSx}>
            <div className="header" style={{ marginLeft: '3em' }}>
              <div className="header-content">
                <div className="heading-div">
                  <Header>Crush Roulette</Header>
                </div>
                <div>
                  <p className="top-text">
                    Submit two people and we'll give them a slightly higher
                    chance of being matched by The Algorithm&trade;. If gender
                    preferences work out, the couple will match to love; else,
                    they'll match as friends! You only get one pair (although
                    you can change or remove it anytime), so choose wisely...
                  </p>
                </div>
              </div>
            </div>

            <div className="main">
              <div className="form-container">
                <Grid columns={[3, '2f 2f 2f']}>
                  <div style={{ position: 'relative' }}>
                    <div
                      hidden={!showSendEmail1}
                      style={{ textAlign: 'right' }}
                      className="not-registered-container"
                    >
                      <p className="not-registered">
                        Looks like {email1} has not signed up for Datamatch.
                        Enter their name below to send them an email letting
                        them know they have a secret admirer ;).
                      </p>
                      <Input
                        handleInputChange={this.handleChange}
                        name="nameEmailInput1"
                        placeholder="Name"
                        type="text"
                        value={nameEmailInput1}
                      />
                      <br />
                      <Button
                        disabled={nameInputLoading1}
                        onClick={() => this.emailSubmit(true)}
                      >
                        Send Email
                      </Button>
                    </div>
                  </div>{' '}
                  {/*div required for grid layout to work; 3 columns*/}
                  <div className="main-container">
                    {crushData}
                    <div className="envelope"></div>
                    <div
                      className={isEmpty(crush) ? 'flip open' : 'flip closed'}
                    >
                      <style>
                        {`
                      @keyframes flipOpen {
                        0% {
                          transform: rotateX(0deg);
                          transform-origin: center top;
                          z-index: 25;
                        }

                        100% {
                          transform: rotateX(180deg);
                          transform-origin: center top;
                          z-index: 0;
                        }
                      }
                      @keyframes flipClose {
                        0% {
                          transform: rotateX(180deg);
                          transform-origin: center top;
                          z-index: 0;
                        }

                        100% {
                          transform: rotateX(0deg);
                          transform-origin: center top;
                          z-index: 25;
                        }
                      }
                      `}
                      </style>
                    </div>
                    <div
                      className={
                        isEmpty(crush)
                          ? 'letter letterOpen'
                          : 'letter letterClose'
                      }
                    >
                      <style>
                        {`
                        @keyframes slideUp {
                          from {
                            top: 0rem;
                          }
                          to {
                            top: -12rem;
                          }
                        }
                        @keyframes slideDown {
                          from {
                            top: -12rem;
                          }
                          to {
                            top: 0rem;
                          }
                        }
                        `}
                      </style>
                      <div className="letter-content">
                        {/*<Grid columns={[3]}>*/}
                        <div className="input1">
                          <img
                            src={outline}
                            alt="person placeholder 1"
                            className="outline"
                          />
                          <div className="input-container">
                            {' '}
                            {/*style={{ position: 'relative' }}*/}
                            <div className="email-auto">
                              <Input
                                type="email"
                                className="crush-roulette-input"
                                name="email1"
                                placeholder="Type an email"
                                value={email1}
                                handleInputChange={this.handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="heart-txt" id="Flabby_sheaf">
                          <img
                            src={heart1}
                            alt="datamatch heart"
                            className="heart"
                          />
                          <div className="submit-button">
                            {this.renderButton(
                              <React.Fragment>Submit Crush</React.Fragment>,
                              this.submitCrush,
                              surveyClosed || showSendEmail1 || showSendEmail2,
                            )}
                          </div>
                        </div>
                        <div className="input2">
                          <img
                            src={outline}
                            alt="person placeholder 2"
                            className="outline"
                          />
                          <div className="input-container">
                            <div className="email-auto">
                              <Input
                                type="email"
                                className="crush-roulette-input"
                                name="email2"
                                placeholder="Type an email"
                                value={email2}
                                handleInputChange={this.handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/*</Grid>*/}
                    </div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div
                      className="not-registered-container"
                      style={{ textAlign: 'left' }}
                      hidden={!showSendEmail2}
                    >
                      <p className="not-registered">
                        Looks like {email2} has not signed up for Datamatch.
                        Enter their name below to send them an email letting
                        them know they have a secret admirer ;).
                      </p>
                      <Input
                        handleInputChange={this.handleChange}
                        name="nameEmailInput2"
                        placeholder="Name"
                        type="text"
                        value={nameEmailInput2}
                      />
                      <br />
                      <Button
                        disabled={nameInputLoading2}
                        onClick={() => this.emailSubmit(false)}
                      >
                        Send Email
                      </Button>
                    </div>
                  </div>
                </Grid>
              </div>
              <br />
              <div className="center submit-div">
                {isEmpty(crush) ? (
                  <div></div>
                ) : (
                  <React.Fragment>
                    {this.renderButton(
                      <React.Fragment>Change Match</React.Fragment>,
                      this.removeCrush,
                      surveyClosed,
                    )}
                  </React.Fragment>
                )}
                <p className="error-message" hidden={!showErrorMessage}>
                  {errorMessage}
                </p>
              </div>
            </div>
            <div className="instructions">
              <Grid gap={'12%'} columns={[3, '1fr 1fr 1fr']}>
                {this.renderInstructions('img-instruction')}
              </Grid>
            </div>
          </div>
        </Container>
      );
    };

    return <div>{isMobile ? renderMobile() : renderDesktop()}</div>;
  }
}

const mapStateToProps = (state, props) => {
  return {
    crush: state.firebase.data.crush,
    updateNotifications: crushExists => {
      props.firebase.update(`/notifs/${props.uid}/pre/`, {
        crush: crushExists,
      });
    },
  };
};

export default compose(
  firebaseConnect(props => [
    {
      path: '/crushes/' + props.uid,
      storeAs: 'crush',
    },
  ]),
  connect(mapStateToProps),
)(PageRoulette);
