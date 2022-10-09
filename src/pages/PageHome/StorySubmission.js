/** @jsx jsx */

import { Component, Fragment } from 'react';
import { firebaseConnect } from 'react-redux-firebase';
import { jsx, Button } from 'theme-ui';

import Textarea from 'components/Textarea';
import { storySubmissionSx } from 'pages/PageHome/PageHomeStyles';

class StorySubmission extends Component {
  constructor(props) {
    super(props);
    this.state = { story: '', submitted: false, error: null, success: false };
  }

  onFormSubmit = async e => {
    e.preventDefault();
    if (this.state.story.length > 10) {
      await this.props.firebase.push('storySubmissions', {
        story: this.state.story,
      });
      this.setState({ submitted: true, error: null, success: true });
    } else {
      this.setState({ error: 'You need to actually submit a story!' });
    }
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  renderForm = () => {
    if (this.state.success) {
      return <div>Thanks for sharing! We appreciate it!</div>;
    } else {
      return (
        <Fragment>
          <div className="main-label">
            <h4>
              Heard a successful/funny/bizarre story about a Datamatch match?
              Tell us!
            </h4>
          </div>
          <div className="sub-label">
            All responses are kept fully anonymous.
          </div>
          <Textarea
            className="textarea"
            name="story"
            rows="4"
            placeholder="My roommate met their Datamatch and they got married three years later!"
            handleInputChange={this.onInputChange}
          />
          <div>
            {this.state.error && (
              <div className="error">{this.state.error}</div>
            )}
            <Button
              className="submit-button"
              type="submit"
              onClick={this.onFormSubmit}
            >
              Submit
            </Button>
          </div>
        </Fragment>
      );
    }
  };

  render() {
    return <div sx={storySubmissionSx}>{this.renderForm()}</div>;
  }
}

export default firebaseConnect()(StorySubmission);
