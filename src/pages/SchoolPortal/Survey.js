/** @jsx jsx */

import { Component } from 'react';
import { jsx, css } from '@emotion/core';
import { Button, Close } from 'theme-ui';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { isLoaded } from 'react-redux-firebase';
import Modal from 'react-bootstrap/Modal';

import Container from 'components/Container';
import Header from 'components/Header';
import Loading from 'components/Loading';

const surveyStyle = css`
  .radio {
    border-radius: 50%;
    border: 2px solid #bd574e;
    min-width: 20px;
    height: 20px;
    background: #dd8078;
    margin-right: 11px;
  }

  .answer {
    padding: 0px 10px;
    height: 40px;
    text-align: left;
    color: #222222;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      background: rgba(196, 196, 196, 0.1);
    }
  }

  .answer-input {
    border-width: 0px;
    padding: 0px;
  }

  .question {
    margin-bottom: 15px;
    position: relative;
  }

  .question-input {
    color: #545353;
    border-width: 0;
    font-size: 1.25rem;
    padding: 0px;
    height: 30px;
    &:hover {
      background: rgba(196, 196, 196, 0.1);
    }
  }

  .question:hover > .removeButton {
    visibility: visible;
  }

  .removeButton {
    position: absolute;
    right: 0px;
    top: 0px;
    visibility: hidden;
    font-size: 13px;
    cursor: pointer;
    &:hover {
      visibility: visible;
    }
  }

  .button-symbol {
    line-height: 29px;
  }

  .round-button {
    background: rgba(249, 198, 195, 0.8);
    border: 3px solid #bd574e;
    border-radius: 50%;
    color: #bd574e;
    cursor: pointer;
    display: inline-block;
    height: 35px;
    text-align: center;
    vertical-align: middle;
    width: 35px;
  }
`;

const surveyModalStyle = css`
  .modal-container {
    text-align: center;
    padding: 40px;
  }

  .modal-question {
    font-size: 22px;
    margin-bottom: 20px;
  }

  .modal-cancel {
    cursor: pointer;
  }
`;

class Survey extends Component {
  state = {
    loading: true,
    modalIndex: 0,
    show: false,
    survey: [],
  };

  componentDidUpdate(prevProps) {
    const { survey } = this.props;
    if (prevProps.survey !== survey) {
      const questions = survey || [];
      this.setState({ loading: false, survey: questions });
    }
  }

  editQuestion = index => {
    return event => {
      const { survey } = this.state;
      const newQuestion = {
        ...survey[index],
        text: event.target.value,
      };
      let newSurvey = survey.slice();
      newSurvey[index] = newQuestion;
      this.setState({ survey: newSurvey });
    };
  };

  editAnswer = (index, answerKey) => {
    return event => {
      let newSurvey = this.state.survey.slice();
      const newQuestion = {
        ...newSurvey[index],
        answers: {
          ...newSurvey[index].answers,
          [answerKey]: event.target.value,
        },
      };
      newSurvey[index] = newQuestion;
      this.setState({ survey: newSurvey });
    };
  };

  addQuestion = () => {
    let newSurvey = this.state.survey.slice();
    const newQuestion = {
      text: 'Question ' + (newSurvey.length + 1),
      answers: {
        0: 'Option 1',
        1: 'Option 2',
        2: 'Option 3',
        3: 'Option 4',
        4: 'Option 5',
      },
    };
    newSurvey.push(newQuestion);
    this.setState({ survey: newSurvey });
  };

  deleteQuestion = index => {
    let newSurvey = this.state.survey.slice();
    newSurvey.splice(index, 1);
    this.setState({ survey: newSurvey, show: false });
  };

  saveSurvey = () => {
    this.props.updateSurvey(this.state.survey);
    alert('Changes saved!');
  };

  confirm = modalIndex => this.setState({ modalIndex, show: true });

  render() {
    if (!isLoaded(this.props.survey)) {
      return <Loading />;
    }

    const { modalIndex, survey, show } = this.state;

    return (
      <Container>
        <div className="SchoolPortalSurvey" css={surveyStyle}>
          <Header>Survey</Header>
          Questions will be displayed in the actual survey in the order shown
          below. Use this markdown guide to format your questions/links:{' '}
          <a
            href="https://docs.google.com/document/d/1bzSYfPmMvsxOnJE9pBEO7Qtz5XMV7S-w1G73coIjeVM/edit"
            target="__blank"
          >
            Markdown guide
          </a>
          .
          <br />
          <br />
          <div>
            {survey.map((question, index) => {
              const answers = question.answers || {};
              const answerKeys = Object.keys(answers)
                .map(s => parseInt(s))
                .sort();

              return (
                <div className="question" key={index}>
                  <input
                    className="question-input"
                    onChange={this.editQuestion(index)}
                    type="text"
                    value={question.text}
                  />
                  <div className="removeButton">
                    <Close bg="lightPink" onClick={() => this.confirm(index)} />
                  </div>

                  {answerKeys.map(answerKey => {
                    const answer = question.answers[answerKey];

                    return (
                      <div key={answerKey} className="answer">
                        <div className="radio" />
                        <input
                          className="answer-input"
                          onChange={this.editAnswer(index, answerKey)}
                          type="text"
                          value={answer}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <Modal
            css={surveyModalStyle}
            onHide={() => this.setState({ show: false })}
            show={show}
          >
            <Modal.Body className="modal-container">
              <h4>Are you sure you want to delete this question?</h4>
              <br />
              <Button onClick={() => this.deleteQuestion(modalIndex)} mr={2}>
                I'm sure.
              </Button>
              <Button
                variant="secondary"
                onClick={() => this.setState({ show: false })}
              >
                Just kidding!
              </Button>
            </Modal.Body>
          </Modal>
          <Button onClick={this.addQuestion}>Add question</Button>
          <br />
          <Button mt={4} variant="accent" onClick={this.saveSurvey}>
            <i className="fas fa-check checkmark"></i>Save Changes
          </Button>
          <br />
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state, props) => {
  const surveyDoc = state.firestore.data.surveyDoc;
  return {
    survey: surveyDoc && (surveyDoc.survey || []),
    updateSurvey: data => {
      props.firestore.set(
        { collection: 'surveys', doc: props.school },
        { survey: data },
      );
    },
  };
};

export default compose(
  firestoreConnect(props => [
    {
      collection: 'surveys',
      doc: props.school,
      storeAs: 'surveyDoc',
    },
  ]),
  connect(mapStateToProps),
)(Survey);
