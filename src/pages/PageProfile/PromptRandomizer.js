/** @jsx jsx */

import { createRef, Component } from 'react';
import { jsx, css } from '@emotion/core';
import Input from 'components/Input';

const slotsStyle = css`
  .slot {
    position: relative;
    height: 25px;
    width: 500px;
  }

  section {
    position: absolute;
    width: 100%;
    height: 25px;
    overflow: hidden;
    line-height: 25px;
    cursor: default;
  }

  .container {
    position: absolute;
    top: 0px;
    width: 100%;
    transition: top ease-in-out 0.7s;
    padding: 2px;
  }
`;

const promptAnswerSx = {
  '.prompt-answer': {
    height: '33px',
    marginBottom: '12px',
    marginTop: '5px',
    maxWidth: '600px',
  },
  '.background-border': {
    background: 'white',
    border: theme => `0.5px solid ${theme.colors.mediumGrey}`,
    boxSizing: 'border-box',
    borderRadius: '3px',
  },
};

class Slots extends Component {
  constructor(props) {
    super(props);
    this.state = { rolling: false };

    // get ref of the disk on which elements will roll
    this.slotRef = createRef();
  }

  componentDidMount() {
    this.triggerSlotRotation(this.slotRef.current);
  }

  componentDidUpdate(prevProps) {
    if (this.props.prompt.id !== prevProps.prompt.id) {
      !this.state.rolling && this.roll();
    }
  }

  // to trigger rolling and maintain state
  roll = () => {
    this.setState({
      rolling: true,
    });
    setTimeout(() => {
      this.setState({ rolling: false });
    }, 700);

    // this will trigger rolling effect
    this.triggerSlotRotation(this.slotRef.current);
  };

  // this will create a rolling effect
  triggerSlotRotation = ref => {
    let options = ref.children;
    let randomOption = this.props.prompt.id;
    let chosenOption = options[randomOption];
    ref.style.top = `${-chosenOption.offsetTop}px`;
    return randomOption;
  };

  render() {
    return (
      <div>
        <div className="SlotMachine" css={slotsStyle}>
          <div className="slot">
            <section>
              <div className="container" ref={this.slotRef}>
                {this.props.Prompts.map((prompt, i) => (
                  <div key={i}>
                    <span>{prompt}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        <Input
          sx={promptAnswerSx}
          className="prompt-answer background-border"
          handleInputChange={event =>
            this.props.handlePromptAnswerChange(event, this.props.count)
          }
          name={'prompt' + this.props.count}
          placeholder={
            this.state.rolling
              ? 'Generating...'
              : this.props.Placeholders[this.props.prompt.id]
          }
          type="text"
          value={this.props.prompt.answer || ''}
        />
      </div>
    );
  }
}

export default Slots;
