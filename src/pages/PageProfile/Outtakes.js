import React from 'react';
import { Button } from 'theme-ui';

import { pageProfileSx } from './PageProfileStyles';
import Slots from './PromptRandomizer';

export function Outtakes({
  promptQuestions,
  prompts,
  shufflePrompts,
  handlePromptAnswerChange,
}) {
  return (
    <div sx={pageProfileSx} className="bottom-elements">
      <div className="question-header">Outtakes</div>
      <div className="question-subheader">
        Help your matches get to know you better! Your responses will be on your
        public profile.
      </div>
      <Slots
        count="0"
        Prompts={promptQuestions[0]}
        Placeholders={promptQuestions[3]}
        prompt={prompts[0]}
        handlePromptAnswerChange={handlePromptAnswerChange}
      />
      <Slots
        count="1"
        Prompts={promptQuestions[1]}
        Placeholders={promptQuestions[4]}
        prompt={prompts[1]}
        handlePromptAnswerChange={handlePromptAnswerChange}
      />
      <Slots
        count="2"
        Prompts={promptQuestions[2]}
        Placeholders={promptQuestions[5]}
        prompt={prompts[2]}
        handlePromptAnswerChange={handlePromptAnswerChange}
      />
      <div className="prompt-save">
        <Button onClick={shufflePrompts}>Shuffle questions</Button>
      </div>
    </div>
  );
}
