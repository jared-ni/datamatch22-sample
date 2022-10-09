import React, { Component } from 'react';
import { feedbackUrl } from 'constants/Feedback';

import { Button } from 'theme-ui';

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = { feedback: '' };
  }

  onFormSubmit = e => {
    e.preventDefault();
    const scriptUrl = feedbackUrl;
    const url = `${scriptUrl}?callback=ctrlq&name=${this.props.name}&email=${this.props.email}&feedback=${this.state.feedback}&sheet=Feedback}`;
    fetch(url, { mode: 'no-cors' }).then(
      () => {
        this.setState({ sent: true });
      },
      () => {
        this.setState({ error: true });
      },
    );
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div>
        <div style={{ textAlign: 'center' }}>
          {!this.state.sent ? (
            <form onSubmit={this.onFormSubmit}>
              <textarea
                onChange={this.onInputChange}
                placeholder={this.props.placeholder}
                type="feedback"
                name="feedback"
                required
                style={{ width: '100%' }}
              />
              <Button>{this.props.buttonText}</Button>
            </form>
          ) : (
            <div>{this.props.submittedText}</div>
          )}
        </div>
      </div>
    );
  }
}

export default Feedback;
