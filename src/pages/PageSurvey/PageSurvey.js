/** @jsx jsx */

import { Component, createRef } from 'react';
import { jsx, Button } from 'theme-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import {
  firebaseConnect,
  firestoreConnect,
  isLoaded,
} from 'react-redux-firebase';
import redFlag from 'assets/red-flag.gif';

import marked from 'marked';
import Modal from 'react-bootstrap/Modal';
import { exportComponentAsJPEG } from 'react-component-export-image';
import { FacebookShareButton } from 'react-share';

import Header from 'components/Header';
import Link from 'components/Link';
import Loading from 'components/Loading';
import Container from 'components/Container';
import Heart from 'assets/rouletteMiniHeart2.svg';
import RedFlagsBackground from 'assets/redflagsbackground.svg';
import RedFlagsIcon from 'assets/redflagsicon.png';
import redFlagsList from 'constants/RedFlags';

import { Mixpanel } from 'utils/mixpanel.js';

import { pageSurveySx, surveyModalSx } from 'pages/PageSurvey/PageSurveyStyles';

class PageSurvey extends Component {
  state = {
    show: false,
    showCompletedModal: false,
    showRedFlag: false,
    showGif: true,
  };

  constructor(props) {
    super(props);
    this.componentRef = createRef();
  }

  componentDidMount() {
    // Web analytics
    Mixpanel.track('Survey_Page', {});
  }

  createRedFlags = async () => {
    const getFlags = this.props.firebase
      .functions()
      .httpsCallable('redFlags-getRedFlags');
    await getFlags();
  };

  // based on the status of the survey and whether the user has
  // completed the survey, it returns the appropriate message
  renderMessage = completed => {
    const { status } = this.props;
    if (status === 'live-survey' || status === 'development') {
      return completed ? (
        <div className="profile-button">
          <h3 style={{ color: '#BB4C4F' }} align="left">
            Thanks for filling out the survey!{' '}
          </h3>
          <div style={{ marginBottom: '10px' }}>
            <div className="left-div">
              <br />
              We've detected some anomalies in your personality...
              <br />
            </div>
            <div className="right-div" align="center">
              <Button
                mt={4}
                onClick={() => {
                  this.setState({ showRedFlag: true });
                  setInterval(() => this.setState({ showGif: false }), 3000);
                }}
              >
                See Red Flags
              </Button>
            </div>
          </div>
          <div>
            <div className="left-div">
              <br />
              Now let's take you to your profile and get you{' '}
              <img alt="heart" width="20" src={Heart} /> match-ready{' '}
              <img alt="heart" width="20" src={Heart} />
              <br />
            </div>
            <div className="right-div" align="center">
              <Button
                mt={4}
                onClick={() => this.props.history.push('/app/profile')}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="incomplete-message">
          Changes saved automatically! Your survey is incomplete. The survey
          closes <b>Feb. 13th 11:59pm ET</b>!
        </div>
      );
    } else if (status === 'live-processing') {
      return (
        <div>
          The survey has closed. Fill out your{' '}
          <Link to="/app/profile">profile!</Link>
        </div>
      );
    } else if (status === 'live-matches') {
      return (
        <div className="profile-button">
          <h3 style={{ color: '#BB4C4F' }} align="left">
            The survey is closed!{' '}
          </h3>
          <div style={{ marginBottom: '10px' }}>
            <div className="left-div">
              <br />
              Check out your matches
              <br />
            </div>
            <div className="right-div" align="center">
              <Button
                mt={4}
                onClick={() => this.props.history.push('/app/results')}
              >
                See Matches
              </Button>
            </div>
          </div>
          <div>
            <div className="left-div">
              <br />
              We've detected some anomalies in your personality...
              <br />
            </div>
            <div className="right-div" align="center">
              <Button
                mt={4}
                onClick={() => {
                  this.setState({ showRedFlag: true });
                }}
              >
                See Red Flags
              </Button>
            </div>
          </div>
        </div>
      );
    }
  };

  renderHeaderMessage = completed => {
    const { status } = this.props;
    if (status === 'live-survey' || status === 'development') {
      return !completed ? (
        <div className="incomplete-message">
          Changes saved automatically! Your survey is incomplete.
        </div>
      ) : null;
    } else if (status === 'live-processing') {
      return (
        <div>
          The survey has closed. Fill out your{' '}
          <Link to="/app/profile">profile!</Link>
        </div>
      );
    } else if (status === 'live-matches') {
      return (
        <div>
          The survey is closed!{' '}
          <Link to="/app/results">Check out your matches!</Link>
        </div>
      );
    }
  };

  renderFlags = () => {
    const redFlagsMap =
      this.props.redFlags && !this.state.showGif ? (
        this.props.redFlags.map(idx => (
          <div style={{ padding: '5px' }}>
            <p>
              {redFlagsList[idx]}
              <br />
              <br />
            </p>
          </div>
        ))
      ) : (
        <div>
          Calculating your red flags...
          <img src={redFlag} alt="Red flag" width="200px" />
        </div>
      );

    return <div>{redFlagsMap}</div>;
  };

  // convert markdown to html
  markdownToHtml(markdown) {
    const html = marked(markdown);
    return { __html: html };
  }

  render() {
    const {
      status,
      survey,
      uid,
      updateResponse,
      updateNotifTrue,
      profile_pic,
      name,
    } = this.props;
    const { show, showCompletedModal, showRedFlag } = this.state;

    // only wait for responses to load if uid exists
    if ((uid && !isLoaded(this.props.responses)) || !isLoaded(survey)) {
      return (
        <div style={{ height: 300 }}>
          <Loading />
        </div>
      );
    }

    if (!survey || (!status.includes('live') && status !== 'development')) {
      return <div>Currently, there's no survey open. Check back soon!</div>;
    }

    // populate the questions from survey if present
    const questions = survey || [];

    // populate user responses, transform object/array into a fixed-size array for sure
    let responses = Array(questions.length).fill(-1);
    Object.keys(this.props.responses || []).forEach(
      id => (responses[id] = this.props.responses[id]),
    );

    // checks if all the questions have been answered
    const completed =
      responses.filter(r => r !== -1).length >= Object.keys(questions).length;

    // When save image button is clicked, download image
    const saveImage = async name => {
      const file_name = name.split(' ')[0] + "'s red flags.jpeg";
      exportComponentAsJPEG(this.componentRef, {
        fileName: file_name,
      });
    };

    // Opens a social media app and downloads an image
    const openSocialMedia = (site, name) => {
      const file_name = name.split(' ')[0] + "'s red flags.jpeg";
      exportComponentAsJPEG(this.componentRef, {
        fileName: file_name,
      });

      if (site === 'instagram') {
        window.open('https://www.instagram.com/');
      } else if (site === 'messenger') {
        window.open('https://messenger.com/');
      }
    };

    return (
      <Container>
        <div sx={pageSurveySx}>
          <Header>Survey</Header>
          <div>
            Don’t overthink these questions. They will reveal things that you
            don't even know about yourself.
          </div>
          <br />
          {this.renderHeaderMessage(completed)}
          <br />

          {questions.map((question, questionIndex) => {
            const { answers, text } = question;

            // stores the sorted answer key indices in an array
            const answerKeys = Object.keys(answers || {})
              .map(s => parseInt(s))
              .sort();

            return (
              <div className="question" key={questionIndex}>
                {/* 'dangerouslySetInnerHTML' tells React that it shouldn't
              need to care about the HTML inside the component */}
                {/* the '##### ' is markdown syntax for header 5 text */}
                <div
                  sx={{ display: 'inline' }}
                  dangerouslySetInnerHTML={this.markdownToHtml(
                    '##### ' + (questionIndex + 1) + '. ' + text,
                  )}
                />
                {/* Iterate over and render each answer choice (differently
              if it's selected by the user) */}
                {answerKeys.map(answerIndex => {
                  const text = answers[answerIndex];
                  const selected = responses[questionIndex] === answerIndex;

                  return (
                    <div
                      className={selected ? 'answer answer-selected' : 'answer'}
                      key={answerIndex}
                      onClick={() => {
                        if (!selected) {
                          // Web analytics - potentially remove since it will log a lot of events
                          // Mixpanel.track('Survey_Updated', {
                          //   [questionIndex]: answerIndex,
                          // });

                          // need a plus 1 here because we are JUST selecting the last response, so responses
                          // should be one less than the survey length
                          // we also need to filter out "empty" responses

                          // we also need to be sure that the following code
                          // only executes when a previously unanswered question is
                          // answered (this will ensure that the survey is actually complete)
                          if (
                            responses.filter(r => r !== -1).length + 1 ===
                              questions.length &&
                            questionIndex === responses.findIndex(r => r === -1)
                          ) {
                            updateNotifTrue();
                            this.setState({ showCompletedModal: true });
                            this.createRedFlags();
                          }

                          // updateResponse is a function passed in as a prop
                          updateResponse(questionIndex, answerIndex);
                        }
                      }}
                    >
                      {/* render the radio button and fill it if selected */}
                      <div className="radio">
                        {selected && <div className="radio-inside" />}
                      </div>

                      {/* render the text for each answer */}
                      <div
                        className="answer-text"
                        dangerouslySetInnerHTML={this.markdownToHtml(text)}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* for a pop-up dialog box */}
          {/* If completed, render red flags */}
          <Modal
            sx={surveyModalSx}
            onHide={() => this.setState({ show: false })}
            show={show}
          >
            <Modal.Body className="modal-container">
              {/* Contains profile pic, red flags to be rendered into image */}
              {/* <ScreenCapture onEndCapture={this.handleScreenCapture}>
                {({ onStartCapture}) => ( */}
              <div
                id="myNode"
                style={{ marginBottom: 20, backgroundColor: 'white' }}
              >
                <img
                  alt="profile pic"
                  style={{
                    width: 150,
                    height: 150,
                    borderStyle: 'solid',
                    borderColor: '#c3423f',
                    borderWidth: 5,
                    borderRadius: 3,
                  }}
                  src={profile_pic || require('assets/empty.png').default}
                  //profile_pic || require('assets/empty.png').default
                />
                <div>{name}</div>
                <div>{this.renderFlags()}</div>
              </div>
            </Modal.Body>
          </Modal>

          {/* pop-up dialog box after completing the survey */}
          {/* Implements red flags */}
          <Modal
            sx={surveyModalSx}
            onHide={() => this.setState({ showCompletedModal: false })}
            show={showCompletedModal}
          >
            <Modal.Body className="modal-container">
              <div
                className="modal-cancel"
                onClick={() => this.setState({ showCompletedModal: false })}
              >
                <div>{this.renderMessage(completed)}</div>
              </div>
            </Modal.Body>
          </Modal>

          {/* pop-up red flags after clicking see results */}
          <Modal
            sx={surveyModalSx}
            onHide={() => this.setState({ showRedFlag: false })}
            show={showRedFlag}
          >
            {/* <div align="right" style={{ marginTop: "15px", marginRight: "15px" }}>
              <img className="modal-cancel" style={{marginBottom: "-30px"}}
              onClick={() => this.setState({ showRedFlag: false })} 
              alt="close" src={ModalClose}/>
            </div> */}
            <Modal.Body className="modal-container">
              <div ref={this.componentRef}>
                <div
                  className="modal-cancel"
                  onClick={() => this.setState({ showRedFlag: false })}
                  style={{
                    backgroundImage: `url(${RedFlagsBackground})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderColor: '#c3423f',
                    borderRadius: 3,
                    padding: '10px',
                  }}
                  align="center"
                >
                  <br />
                  <br />
                  <img
                    alt="profilepic"
                    width="40%"
                    src={profile_pic || require('assets/empty.png').default}
                    style={{
                      borderStyle: 'solid',
                      borderWidth: 4.5,
                      borderColor: '#c3423f',
                      borderRadius: 3,
                    }}
                    onError={event => {
                      event.target.src = require('assets/empty.png').default;
                      event.onerror = null;
                    }}
                  />
                  <br />
                  <br />
                  <h2 style={{ color: '#BB4C4F' }}>
                    {name && name.split(' ')[0]}'s <br /> Red Flags
                  </h2>
                  <br />
                  <img alt="redflags" width="25%" src={RedFlagsIcon} />
                  <br />
                  <br />
                  <div>{this.renderFlags()}</div>
                  <br />
                  <p style={{ color: '#BB4C4F' }} align="center">
                    datamatch.me
                  </p>
                  <br />
                </div>
              </div>
              <div align="center">
                <br />
                <Button
                  variant="primary"
                  onClick={() => {
                    saveImage(name);
                  }}
                  style={{ marginRight: 5 }}
                >
                  <i className="fas fa-check checkmark"></i> Save Image
                </Button>
                <br />
                <br />

                <FacebookShareButton
                  url="https://datamatch.me/"
                  quote="Check out Datamatch! It's the coolest college matchmaking app ever!"
                  hashtag="#Datamatch"
                >
                  <Button
                    variant="primary"
                    onClick={() => saveImage(name)}
                    style={{
                      marginRight: 5,
                      color: 'white',
                      backgroundColor: '#1778F2',
                    }}
                  >
                    <i className="fab fa-facebook fa-lg" />
                  </Button>
                </FacebookShareButton>
                <Button
                  variant="primary"
                  onClick={() => openSocialMedia('messenger', name)}
                  style={{
                    marginRight: 5,
                    color: 'white',
                    backgroundColor: '#00B2FF',
                  }}
                >
                  <i className="fab fa-facebook-messenger" />
                </Button>
                <Button
                  variant="primary"
                  onClick={() => openSocialMedia('instagram', name)}
                  style={{
                    marginRight: 5,
                    color: 'white',
                    backgroundColor: '#E1306C',
                  }}
                >
                  <i className="fab fa-instagram fa-lg" />
                </Button>
              </div>
            </Modal.Body>
          </Modal>

          <Button
            variant="primary"
            onClick={() =>
              this.setState({
                showCompletedModal: true,
                profile_pic_url: profile_pic,
              })
            }
          >
            <i className="fas fa-check checkmark"></i>
            Save Changes
          </Button>
          <br />
          <br />
          <div>{this.renderMessage(completed)}</div>
          <br />
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state, props) => {
  const profile = state.firebase.profile;
  const { firebase, status, uid } = props;
  const { push } = props.firebase;
  const surveyDoc = state.firestore.data.surveyDoc;
  const redFlags = state.firebase.data.redFlags;

  return {
    name: profile.name,
    profile_pic: profile.profile_pic,
    responses: state.firebase.data.responses,
    survey: surveyDoc && surveyDoc.survey,
    redFlags: redFlags,
    // updates the answer on Firebase based on the questionId
    // and the responseId provided as arguments to the function
    updateResponse: (questionId, responseId) => {
      if (status === 'live-survey' || status === 'development') {
        // only update firebase if the uid exists
        uid &&
          firebase.update('/responses/' + uid, {
            [questionId]: responseId,
          });
      }
    },

    // copypaste
    updateRedFlags: redFlag => {
      push('/privateProfile/' + uid, {
        redFlag,
      });
    },
    //copypaste

    updateNotifTrue: () => {
      firebase.update(`/notifs/${uid}/pre/`, { survey: true });
    },
  };
};

export default compose(
  // if no uid is provided, we don't pull their responses
  firebaseConnect(({ uid }) =>
    uid
      ? [
          {
            path: '/responses/' + uid,
            storeAs: 'responses',
          },
          {
            path: '/privateProfile/' + uid + '/redFlags',
            storeAs: 'redFlags',
          },
        ]
      : [],
  ),
  firestoreConnect(props => [
    {
      collection: 'surveys',
      doc: props.surveyKey,
      storeAs: 'surveyDoc',
    },
  ]),
  connect(mapStateToProps),
  withRouter,
)(PageSurvey);
