/** @jsx jsx */

import { jsx } from 'theme-ui';

import marked from 'marked';

import { pageSurveySx } from 'pages/PageSurvey/PageSurveyStyles';

const ChatQuestion = ({ message: { answer, question, sender } }) => {
  const chatSx = {
    padding: '10px 10px',
    margin: '15px 20px 15px 0px',
    background: 'white',
    border: '1px solid #B1B1B1',
    borderRadius: '5px',
  };
  // convert markdown to html
  function markdownToHtml(markdown) {
    const html = marked(markdown);
    return { __html: html };
  }

  return (
    <div sx={chatSx}>
      <div sx={pageSurveySx}>
        <div className="question">
          {/* 'dangerouslySetInnerHTML' tells React that it shouldn't
            need to care about the HTML inside the component */}
          {/* the '##### ' is markdown syntax for header 5 text */}
          <div
            sx={{ display: 'inline' }}
            dangerouslySetInnerHTML={markdownToHtml('##### ' + question)}
          />
          <div className={'answer'}>
            {/* render the radio button and fill it if selected */}
            <div className="radio">{<div className="radio-inside" />}</div>

            {/* render the text for each answer */}
            <div
              className="answer-text"
              dangerouslySetInnerHTML={markdownToHtml(answer)}
            />
          </div>
        </div>
      </div>
      <div style={{ fontSize: '15px' }}>
        <em>answered by a {sender}</em>
      </div>
    </div>
  );
};

export default ChatQuestion;
