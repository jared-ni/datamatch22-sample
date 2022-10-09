/** @jsx jsx */

import { Component } from 'react';
import { jsx, css } from '@emotion/core';
import ReactLoading from 'react-loading';
import { firebaseConnect } from 'react-redux-firebase';

import { Button } from 'theme-ui';

const emailStyle = css`
  display: flex;
  align-items: center;
  margin-top: 3em;

  form {
    display: flex;
    max-width: 300px;
    margin: 1em auto;
  }

  input {
    border: none;
    background: #fff;
    border-radius: 5px;
    margin: 0px 10px;
    height: 40px;
    width: 200px;
  }

  i {
    font-size: 12px;
    align-items: center;
    display: flex;
    justify-content: center;
  }
`;

class EmailForm extends Component {
  state = { email: '', loading: false };

  onFormSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true });
    const interest = {
      email: this.state.email,
      team: this.props.team || null,
    };
    await this.props.firebase.push('interest').set(interest);
    this.setState({ loading: false, sent: true });
  };

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div
        className="email"
        style={{ justifyContent: this.props.center ? 'center' : 'flex-start' }}
        css={emailStyle}
      >
        <div style={{ textAlign: 'center' }}>
          <div>Want to be notified when Datamatch launches?</div>
          {!this.state.sent ? (
            !this.state.loading ? (
              <form onSubmit={this.onFormSubmit}>
                <input
                  onChange={this.onInputChange}
                  placeholder="Your email"
                  type="email"
                  name="email"
                  required
                />
                <Button>Submit</Button>
              </form>
            ) : (
              <ReactLoading
                type="bubbles"
                width={30}
                height={30}
                color="black"
              />
            )
          ) : (
            <div style={{ margin: 5 }}>
              {"Thank you! We'll reach out soon 😎"}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default firebaseConnect()(EmailForm);
