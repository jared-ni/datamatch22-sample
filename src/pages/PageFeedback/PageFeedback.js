/** @jsx jsx */

import { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { jsx, Button } from 'theme-ui';

import Container from 'components/Container';
import Header from 'components/Header';
import { Mixpanel } from 'utils/mixpanel';

class PageFeedback extends Component {
  state = { feedback: '' };

  componentDidMount() {
    // Web analytics
    Mixpanel.track('Feedback_Page', {});
  }

  onFormSubmit = async e => {
    e.preventDefault();
    try {
      await this.props.firebase.push('feedback', {
        feedback: this.state.feedback,
        name: this.props.name,
        email: this.props.email,
      });
      this.setState({ sent: true });
    } catch {
      this.setState({ error: true });
    }
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Container>
        <div
          className="PageFeedback"
          sx={{ backgroundColor: theme => theme.colors.background }}
        >
          <Header>Feedback</Header>
          <br />
          <div>
            We're constantly trying to iterate on and improve Datamatch. Feel
            free to send us your thoughts on how we can improve the product for
            you and what problems you'd like for us to solve!
          </div>
          <br />
          <div style={{ textAlign: 'center' }}>
            {!this.state.sent ? (
              <form onSubmit={this.onFormSubmit}>
                <textarea
                  onChange={this.onInputChange}
                  placeholder="Your thoughts.."
                  type="feedback"
                  name="feedback"
                  required
                  style={{
                    width: '100%',
                    height: 300,
                    backgroundColor: '#fff',
                  }}
                />
                <br />
                <br />
                <Button>Send your feedback!</Button>
              </form>
            ) : (
              <h4>
                Thank you for your feedback! We'll try our best to address any
                concerns!
              </h4>
            )}
          </div>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { email } = state.firebase.auth;
  const { name } = state.firebase.profile;
  return { email, name };
};

export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(PageFeedback);
